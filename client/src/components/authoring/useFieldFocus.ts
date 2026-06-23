import { useCallback } from "react";
import { fieldSelector, normalizeFieldPath } from "./fieldRegistry";

export function useFieldFocus() {
  return useCallback((rawPath?: string) => {
    const path = normalizeFieldPath(rawPath);
    if (!path) return false;
    const element = document.querySelector<HTMLElement>(fieldSelector(path)) ?? document.querySelector<HTMLElement>(fieldSelector(path.replace(/\.\d+$/, "")));
    if (!element) return false;
    const details = element.closest("details") as HTMLDetailsElement | null;
    if (details) details.open = true;
    element.scrollIntoView({ block: "center", behavior: "smooth" });
    const focusable = element.querySelector<HTMLElement>("input, textarea, select, button, [tabindex]");
    window.setTimeout(() => (focusable ?? element).focus({ preventScroll: true }), 180);
    element.classList.remove("authoring-field-highlight");
    void element.offsetWidth;
    element.classList.add("authoring-field-highlight");
    return true;
  }, []);
}
