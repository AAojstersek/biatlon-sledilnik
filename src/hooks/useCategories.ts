import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Category, CategoryKind } from '../types/models';

const KIND_ORDER: CategoryKind[] = ['son', 'daughter'];

export function useCategories(): Category[] {
  return (
    useLiveQuery(
      async () => {
        const all = await db.categories.toArray();
        return all.sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
      },
      [],
      [],
    ) ?? []
  );
}

export function useCategoryByKind(kind: CategoryKind): Category | undefined {
  return useLiveQuery(() => db.categories.where('kind').equals(kind).first(), [kind]);
}
