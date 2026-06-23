import { Handle, Position, type NodeProps } from "reactflow";
import type { SceneGraphNode } from "../../../types/sceneGraphTypes";

export function QuestNode({ data, selected }: NodeProps<SceneGraphNode>) {
  return <div className={`scene-graph-gate scene-graph-gate--quest${selected ? " is-selected" : ""}`}><Handle type="source" position={Position.Right} /><strong>{data.title}</strong><small>{data.questId}</small></div>;
}
