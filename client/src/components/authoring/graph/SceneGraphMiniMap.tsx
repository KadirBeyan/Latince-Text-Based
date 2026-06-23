import { MiniMap } from "reactflow";

export function SceneGraphMiniMap() {
  return <MiniMap pannable zoomable nodeStrokeWidth={2} nodeColor={(node) => node.type === "missing-scene" ? "#8f2f24" : node.type === "completion-scene" ? "#d7a85f" : "#6d5130"} />;
}
