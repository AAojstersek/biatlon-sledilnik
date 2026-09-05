import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Competition } from '../types/models';

export function useCompetition(id: string | undefined): Competition | undefined {
  return useLiveQuery(async () => {
    if (!id) return undefined;
    return db.competitions.get(id);
  }, [id]);
}
