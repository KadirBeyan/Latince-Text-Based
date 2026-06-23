import { Handle, Position, type NodeProps } from "reactflow";
import { VpBadge } from "../../ui";
import type { SceneGraphNode } from "../../../types/sceneGraphTypes";
import { GraphIssueBadge } from "./GraphIssueBadge";

export function SceneNode({ data, selected }: NodeProps<SceneGraphNode>) {
  const node = data;
  return <div className={`scene-graph-node scene-graph-node--${node.type}${selected ? " is-selected" : ""}${node.status.reachable ? "" : " is-unreachable"}`}>
    <Handle type="target" position={Position.Left} />
    <div className="scene-graph-node__top"><strong>{node.title}</strong><GraphIssueBadge {...node.issueCounts} /></div>
    <small>{node.sceneId ?? node.id}</small>
    <div className="scene-graph-node__badges">
      {node.inputMode ? <VpBadge variant={node.inputMode === "text" ? "gold" : node.inputMode === "hybrid" ? "red" : "bronze"}>{node.inputMode}</VpBadge> : null}
      {node.locationId ? <VpBadge variant="muted">{node.locationId}</VpBadge> : null}
      {node.status.isCompletion ? <VpBadge variant="success">completion</VpBadge> : null}
      {node.status.isMissing ? <VpBadge variant="red">missing</VpBadge> : null}
    </div>
    {node.learningFocus?.grammarIds?.length ? <p>{node.learningFocus.grammarIds.slice(0, 2).join(" · ")}</p> : null}
    <Handle type="source" position={Position.Right} />
  </div>;
}
