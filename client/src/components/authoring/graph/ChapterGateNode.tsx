import { Handle, Position, type NodeProps } from "reactflow";
import type { SceneGraphNode } from "../../../types/sceneGraphTypes";

export function ChapterGateNode({ data, selected }: NodeProps<SceneGraphNode>) {
  return <div className={`scene-graph-gate scene-graph-gate--chapter${selected ? " is-selected" : ""}`}><Handle type="source" position={Position.Right} /><strong>{data.title}</strong><small>{data.chapterId}</small></div>;
}
