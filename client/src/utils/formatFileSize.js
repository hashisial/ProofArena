export function formatFileSize(bytes, fallback = "No file size") {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1)} ${units[unitIndex]}`;
}
