import type { ReactNode } from "react";
import type { FieldPath } from "./fieldRegistry";

export function FieldAnchor({ fieldPath, children }: { fieldPath: FieldPath; children: ReactNode }) {
  return <div data-field-path={fieldPath} className="authoring-field-anchor">{children}</div>;
}
