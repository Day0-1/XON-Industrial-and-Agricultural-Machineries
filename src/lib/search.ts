type SearchDocument = Record<string, unknown>;

/** Trim and normalize `?q=` from the URL. */
export function parseSearchQuery(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, 100);
  return trimmed.length > 0 ? trimmed : undefined;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildSearchFilter(
  search: string | undefined,
): SearchDocument | null {
  if (!search) return null;
  const regex = new RegExp(escapeRegex(search), "i");
  return {
    $or: [{ name: regex }, { description: regex }],
  };
}

export function mergeQueryWithSearch(
  base: SearchDocument,
  search: string | undefined,
): SearchDocument {
  const searchFilter = buildSearchFilter(search);
  if (!searchFilter) return base;

  if (Object.keys(base).length === 0) return searchFilter;

  return { $and: [base, searchFilter] };
}
