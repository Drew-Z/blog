type SortableEntry = {
  id?: string;
  slug?: string;
  data: {
    pubDate: Date;
    updatedDate?: Date;
    featured?: boolean;
  };
};

export function getEntryTimestamp(entry: SortableEntry): number {
  return (entry.data.updatedDate ?? entry.data.pubDate).valueOf();
}

export function sortEditorialEntries<T extends SortableEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.data.featured)) - Number(Boolean(a.data.featured));
    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return getEntryTimestamp(b) - getEntryTimestamp(a);
  });
}

export function getEntryNeighbors<T extends SortableEntry>(
  entries: T[],
  predicate: (entry: T) => boolean
) {
  const ordered = sortEditorialEntries(entries);
  const index = ordered.findIndex(predicate);

  return {
    newer: index > 0 ? ordered[index - 1] : undefined,
    older: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined
  };
}
