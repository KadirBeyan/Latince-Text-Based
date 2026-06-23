import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "reactflow";
import type { SceneGraphEdge } from "../../../types/sceneGraphTypes";

export function GraphEdgeLabel(props: EdgeProps<SceneGraphEdge>) {
  const [path, labelX, labelY] = getBezierPath(props);
  const data = props.data;
  const style = { stroke: edgeColor(data), strokeWidth: 2.2, strokeDasharray: data?.status.isBroken || data?.type === "effect-go-to" ? "6 5" : undefined };
  return <><BaseEdge path={path} markerEnd={props.markerEnd} style={style} /><EdgeLabelRenderer>{data?.label ? <span className="scene-graph-edge-label" style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}>{data.status.hasCondition ? "lock " : ""}{data.label}</span> : null}</EdgeLabelRenderer></>;
}

function edgeColor(edge: SceneGraphEdge | undefined): string {
  if (edge?.status.isBroken) return "#d76957";
  if (edge?.type === "success") return "#9bb76f";
  if (edge?.type === "failure") return "#b85a4a";
  return "#9d7b45";
}
