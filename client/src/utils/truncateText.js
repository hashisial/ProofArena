export function truncateText(text, maxLength = 120) {
  const value = String(text ?? "").trim();

  if (!value || value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, Math.max(maxLength - 1, 0)).trimEnd();
  return `${truncated}…`;
}
