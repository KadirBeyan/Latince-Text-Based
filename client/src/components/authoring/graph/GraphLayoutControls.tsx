import { ArrowsOut, GitBranch } from "@phosphor-icons/react";
import { VpButton } from "../../ui";

export function GraphLayoutControls({ onFit, onLayout }: { onFit: () => void; onLayout: () => void }) {
  return <div className="scene-graph-layout-controls"><VpButton variant="ghost" icon={<ArrowsOut size={16} />} onClick={onFit}>Fit</VpButton><VpButton variant="ghost" icon={<GitBranch size={16} />} onClick={onLayout}>Auto layout</VpButton></div>;
}
