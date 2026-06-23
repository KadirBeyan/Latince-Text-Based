import dagre from "dagre";
import type { SceneGraph } from "./SceneGraphTypes";

export type SceneGraphLayoutOptions = { direction?: "LR" | "TB"; neighborhood?: boolean };

export class SceneGraphLayoutService {
  layoutGraph(graph: SceneGraph, options: SceneGraphLayoutOptions = {}): SceneGraph {
    return options.neighborhood ? this.layoutNeighborhood(graph) : this.layoutHierarchical(graph, options.direction ?? "LR");
  }

  layoutHierarchical(graph: SceneGraph, direction: "LR" | "TB" = "LR"): SceneGraph {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, nodesep: 42, ranksep: 96, marginx: 28, marginy: 28 });
    for (const node of graph.nodes) g.setNode(node.id, { width: node.status.isMissing ? 170 : 230, height: 96 });
    for (const edge of graph.edges) g.setEdge(edge.source, edge.target);
    dagre.layout(g);
    const nodes = graph.nodes.map((node) => {
      const point = g.node(node.id) as { x?: number; y?: number } | undefined;
      const offset = node.status.isMissing ? 260 : 0;
      return { ...node, position: { x: Math.round((point?.x ?? 0) - 115 + offset), y: Math.round((point?.y ?? 0) - 48) } };
    });
    return { ...graph, nodes };
  }

  layoutNeighborhood(graph: SceneGraph): SceneGraph {
    const center = graph.nodes.find((node) => node.sceneId === (graph.scope.type === "scene-neighborhood" ? graph.scope.sceneId : undefined)) ?? graph.nodes[0];
    const nodes = graph.nodes.map((node, index) => {
      if (center && node.id === center.id) return { ...node, position: { x: 0, y: 0 } };
      const angle = (Math.PI * 2 * index) / Math.max(1, graph.nodes.length - 1);
      const radius = node.status.isMissing ? 460 : 330;
      return { ...node, position: { x: Math.round(Math.cos(angle) * radius), y: Math.round(Math.sin(angle) * radius) } };
    });
    return { ...graph, nodes };
  }
}
