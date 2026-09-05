import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Competition } from '../types/models';

export function useCompetitions(categoryId?: string): Competition[] {
  return (
    useLiveQuery(async () => {
      const all = categoryId
        ? await db.competitions.where('categoryId').equals(categoryId).toArray()
        : await db.competitions.toArray();
      return all.sort((a, b) => b.date.localeCompare(a.date));
    }, [categoryId]) ?? []
  );
}
