import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Competitor } from '../types/models';

export function useCompetitors(categoryId: string | undefined, includeArchived = true): Competitor[] {
  return (
    useLiveQuery(async () => {
      if (!categoryId) return [];
      const all = await db.competitors.where('categoryId').equals(categoryId).toArray();
      const filtered = includeArchived ? all : all.filter((c) => !c.archived);
      return filtered.sort((a, b) => {
        if (a.isChild !== b.isChild) return a.isChild ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }, [categoryId, includeArchived]) ?? []
  );
}

export function useAllCompetitors(): Competitor[] {
  return useLiveQuery(() => db.competitors.toArray(), [], []) ?? [];
}
