import type { SceneGraph, SceneGraphIssue, SceneGraphNode } from "./SceneGraphTypes";

export class SceneGraphAnalyzer {
  analyzeGraph(graph: SceneGraph): SceneGraphIssue[] {
    return [
      ...this.findBrokenLinks(graph),
      ...this.findUnreachableScenes(graph),
      ...this.findDeadEnds(graph),
      ...this.findMissingTextChallengePaths(graph),
      ...this.findCrossChapterLinks(graph),
      ...this.findCrossQuestLinks(graph),
      ...this.findCycles(graph),
      ...this.findMissingCompletionPath(graph),
    ];
  }

  findBrokenLinks(graph: SceneGraph): SceneGraphIssue[] {
    const nodeIds = new Set(graph.nodes.map((node) => node.id));
    return graph.edges.filter((edge) => !nodeIds.has(edge.target) || graph.nodes.find((node) => node.id === edge.target)?.status.isMissing).map((edge, index) => ({
      id: `broken-link-${index}-${edge.id}`,
      severity: "error",
      code: "broken-link",
      messageTr: `Baglanti hedef sahnesi bulunamadi: ${edge.target}`,
      sceneId: graph.nodes.find((node) => node.id === edge.source)?.sceneId,
      edgeId: edge.id,
      targetId: edge.target.replace(/^missing:/, ""),
    }));
  }

  findUnreachableScenes(graph: SceneGraph): SceneGraphIssue[] {
    const reachable = this.reachableNodeIds(graph);
    return graph.nodes.filter((node) => this.isSceneNode(node) && !reachable.has(node.id) && !node.status.isMissing).map((node, index) => ({
      id: `unreachable-scene-${index}-${node.id}`,
      severity: node.type === "review-scene" ? "info" : "warning",
      code: "unreachable-scene",
      messageTr: `Sahne baslangictan ulasilamiyor: ${node.sceneId ?? node.id}`,
      sceneId: node.sceneId,
    }));
  }

  findDeadEnds(graph: SceneGraph): SceneGraphIssue[] {
    const outgoing = this.outgoingMap(graph);
    return graph.nodes.filter((node) => this.isSceneNode(node) && !node.status.isCompletion && !node.status.isMissing && (outgoing.get(node.id)?.length ?? 0) === 0).map((node, index) => ({
      id: `dead-end-${index}-${node.id}`,
      severity: "warning",
      code: "dead-end",
      messageTr: `Sahne completion degil ama cikis baglantisi yok: ${node.sceneId ?? node.id}`,
      sceneId: node.sceneId,
    }));
  }

  findCycles(graph: SceneGraph): SceneGraphIssue[] {
    const outgoing = this.outgoingMap(graph);
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: SceneGraphIssue[] = [];
    const visit = (nodeId: string, path: string[]) => {
      if (visiting.has(nodeId)) {
        const cycle = path.slice(path.indexOf(nodeId)).concat(nodeId);
        const isReview = cycle.some((id) => graph.nodes.find((node) => node.id === id)?.type === "review-scene");
        cycles.push({ id: `cycle-detected-${cycles.length}-${nodeId}`, severity: isReview ? "info" : "warning", code: "cycle-detected", messageTr: `Dongu tespit edildi: ${cycle.join(" -> ")}`, sceneId: graph.nodes.find((node) => node.id === nodeId)?.sceneId });
        return;
      }
      if (visited.has(nodeId)) return;
      visiting.add(nodeId);
      for (const edge of outgoing.get(nodeId) ?? []) visit(edge.target, [...path, edge.target]);
      visiting.delete(nodeId);
      visited.add(nodeId);
    };
    for (const node of graph.nodes) visit(node.id, [node.id]);
    return cycles;
  }

  findMissingTextChallengePaths(graph: SceneGraph): SceneGraphIssue[] {
    const issues: SceneGraphIssue[] = [];
    for (const node of graph.nodes.filter((item) => item.type === "text-challenge-scene" || item.type === "hybrid-scene")) {
      const outgoing = graph.edges.filter((edge) => edge.source === node.id);
      if (!outgoing.some((edge) => edge.type === "success")) issues.push({ id: `missing-success-path-${issues.length}-${node.id}`, severity: "warning", code: "missing-success-path", messageTr: `Text challenge success path eksik: ${node.sceneId}`, sceneId: node.sceneId });
      if (!outgoing.some((edge) => edge.type === "failure")) issues.push({ id: `missing-failure-path-${issues.length}-${node.id}`, severity: node.learningFocus?.grammarIds.includes("intro") ? "info" : "warning", code: "missing-failure-path", messageTr: `Text challenge failure path eksik: ${node.sceneId}`, sceneId: node.sceneId });
    }
    return issues;
  }

  findCrossChapterLinks(graph: SceneGraph): SceneGraphIssue[] {
    if (graph.scope.type !== "chapter") return [];
    return graph.edges.flatMap((edge, index) => {
      const source = graph.nodes.find((node) => node.id === edge.source);
      const target = graph.nodes.find((node) => node.id === edge.target);
      if (!source?.chapterId || !target?.chapterId || source.chapterId === target.chapterId) return [];
      return [{ id: `chapter-cross-link-${index}-${edge.id}`, severity: edge.type === "completion" ? "info" : "warning", code: "chapter-cross-link", messageTr: `Chapter disina baglanti: ${source.chapterId} -> ${target.chapterId}`, sceneId: source.sceneId, edgeId: edge.id, targetId: target.sceneId }] satisfies SceneGraphIssue[];
    });
  }

  findCrossQuestLinks(graph: SceneGraph): SceneGraphIssue[] {
    if (graph.scope.type !== "quest") return [];
    return graph.edges.flatMap((edge, index) => {
      const source = graph.nodes.find((node) => node.id === edge.source);
      const target = graph.nodes.find((node) => node.id === edge.target);
      if (!source?.questId || !target?.questId || source.questId === target.questId) return [];
      return [{ id: `quest-cross-link-${index}-${edge.id}`, severity: edge.type === "completion" ? "info" : "warning", code: "quest-cross-link", messageTr: `Quest disina baglanti: ${source.questId} -> ${target.questId}`, sceneId: source.sceneId, edgeId: edge.id, targetId: target.sceneId }] satisfies SceneGraphIssue[];
    });
  }

  findMissingCompletionPath(graph: SceneGraph): SceneGraphIssue[] {
    if (graph.scope.type !== "quest") return [];
    const reachable = this.reachableNodeIds(graph);
    if (graph.nodes.some((node) => node.status.isCompletion && reachable.has(node.id))) return [];
    return [{ id: `missing-completion-${graph.scope.questId}`, severity: "error", code: "missing-completion", messageTr: "Quest graph completion path'e ulasamiyor." }];
  }

  applyIssues(graph: SceneGraph): SceneGraph {
    const issues = this.analyzeGraph(graph);
    const reachable = this.reachableNodeIds(graph);
    const outgoing = this.outgoingMap(graph);
    const nodes = graph.nodes.map((node) => {
      const nodeIssues = issues.filter((issue) => issue.sceneId === node.sceneId || issue.targetId === node.sceneId);
      const isDeadEnd = node.status.isDeadEnd || Boolean(node.sceneId && nodeIssues.some((issue) => issue.code === "dead-end"));
      return {
        ...node,
        type: isDeadEnd && !node.status.isCompletion && !node.status.isMissing ? "dead-end" as const : node.type,
        status: {
          ...node.status,
          reachable: node.status.isStart || reachable.has(node.id),
          hasErrors: nodeIssues.some((issue) => issue.severity === "error"),
          hasWarnings: nodeIssues.some((issue) => issue.severity === "warning"),
          isDeadEnd,
        },
        issueCounts: {
          errors: nodeIssues.filter((issue) => issue.severity === "error").length,
          warnings: nodeIssues.filter((issue) => issue.severity === "warning").length,
          info: nodeIssues.filter((issue) => issue.severity === "info").length,
        },
      };
    });
    const edges = graph.edges.map((edge) => {
      const edgeIssues = issues.filter((issue) => issue.edgeId === edge.id);
      return { ...edge, issues: edgeIssues, status: { ...edge.status, valid: edgeIssues.every((issue) => issue.severity !== "error"), isBroken: edgeIssues.some((issue) => issue.code === "broken-link") } };
    });
    return { ...graph, nodes, edges, issues, stats: this.stats({ ...graph, nodes, edges, issues }, outgoing) };
  }

  private stats(graph: SceneGraph, outgoing = this.outgoingMap(graph)): SceneGraph["stats"] {
    const reachable = this.reachableNodeIds(graph);
    return {
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      reachableCount: graph.nodes.filter((node) => this.isSceneNode(node) && reachable.has(node.id)).length,
      unreachableCount: graph.issues.filter((issue) => issue.code === "unreachable-scene").length,
      deadEndCount: graph.issues.filter((issue) => issue.code === "dead-end").length,
      brokenLinkCount: graph.issues.filter((issue) => issue.code === "broken-link").length,
      cycleCount: graph.issues.filter((issue) => issue.code === "cycle-detected").length,
      completionPathCount: graph.nodes.filter((node) => node.status.isCompletion && reachable.has(node.id) && (outgoing.get(node.id)?.length ?? 0) === 0).length,
    };
  }

  private reachableNodeIds(graph: SceneGraph): Set<string> {
    const starts = graph.nodes.filter((node) => node.status.isStart || node.type === "chapter-start" || node.type === "quest-start").map((node) => node.id);
    const outgoing = this.outgoingMap(graph);
    const seen = new Set<string>();
    const visit = (id: string) => {
      if (seen.has(id)) return;
      seen.add(id);
      for (const edge of outgoing.get(id) ?? []) visit(edge.target);
    };
    starts.forEach(visit);
    return seen;
  }

  private outgoingMap(graph: SceneGraph): Map<string, typeof graph.edges> {
    const map = new Map<string, typeof graph.edges>();
    for (const edge of graph.edges) map.set(edge.source, [...(map.get(edge.source) ?? []), edge]);
    return map;
  }

  private isSceneNode(node: SceneGraphNode): boolean {
    return Boolean(node.sceneId) && node.type !== "chapter-start" && node.type !== "quest-start";
  }
}
