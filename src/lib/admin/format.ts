/** Compact display for large click counts (e.g. 1.2M, 10.5K). */
export function formatClickCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "0";
  if (count >= 1_000_000) {
    const value = count / 1_000_000;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    const value = count / 1_000;
    return `${value >= 100 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toLocaleString();
}

export function formatClickCountFull(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "0";
  return count.toLocaleString();
}
