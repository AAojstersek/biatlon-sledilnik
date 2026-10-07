import type { Competitor } from '../types/models';

/** Competitors with a start number first (ascending), then the rest in their original order. */
export function sortByStartNumber<T extends Pick<Competitor, 'id'>>(
  competitors: T[],
  startNumbers: Record<string, string> = {},
): T[] {
  return [...competitors].sort((a, b) => {
    const na = startNumbers[a.id];
    const nb = startNumbers[b.id];
    if (na && nb) return Number(na) - Number(nb);
    if (na) return -1;
    if (nb) return 1;
    return 0;
  });
}
