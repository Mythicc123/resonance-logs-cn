// Maps from internal EN key → display EN label (identity, kept for tooltip use)
// Previously these mapped to ZH labels which caused CN text in the live window.

export function toClassLabel(className: string): string {
  // Internal class names are already English — return as-is
  return className ?? "";
}

export function toSpecLabel(specName: string): string {
  // Internal spec names are already English — return as-is
  return specName ?? "";
}

export function formatClassSpecLabel(
  className: string,
  specName?: string,
): string {
  const classLabel = toClassLabel(className);
  const specLabel = specName ? toSpecLabel(specName) : "";
  if (!classLabel && !specLabel) return "";
  if (!classLabel) return specLabel;
  if (!specLabel) return classLabel;
  return `${classLabel} - ${specLabel}`;
}
