import { CaretDown, FileText } from "@phosphor-icons/react";
import { VpBadge } from "../ui";
import { useAuthoringStore } from "../../stores/authoringStore";
import type { AuthoringTreeNode } from "../../types/authoringTypes";

export function ContentTree() {
  const { tree, selectedPath, selectDocument } = useAuthoringStore();
  return <nav className="authoring-tree" aria-label="Authoring content tree">{tree.map((node) => <TreeNode key={node.id} node={node} selectedPath={selectedPath} onSelect={(kind, path) => void selectDocument(kind, path)} />)}</nav>;
}

function TreeNode({ node, selectedPath, onSelect }: { node: AuthoringTreeNode; selectedPath: string | null; onSelect: (kind: any, path: string) => void }) {
  if (node.kind === "folder") return <section className="authoring-tree-group"><h3><CaretDown size={14} />{node.title}<span>{node.issueCount ? <VpBadge variant="red">{node.issueCount}</VpBadge> : null}{node.warningCount ? <VpBadge variant="gold">{node.warningCount}</VpBadge> : null}</span></h3>{node.children?.map((child, index) => <TreeNode key={`${child.kind}-${child.path ?? child.id}-${index}`} node={child} selectedPath={selectedPath} onSelect={onSelect} />)}</section>;
  return <button type="button" className={selectedPath === node.path ? "active" : ""} onClick={() => node.path && onSelect(node.kind, node.path)}><FileText size={15} /><span>{node.title}</span>{node.issueCount ? <VpBadge variant="red">{node.issueCount}</VpBadge> : node.warningCount ? <VpBadge variant="gold">{node.warningCount}</VpBadge> : null}</button>;
}
