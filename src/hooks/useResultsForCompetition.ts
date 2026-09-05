import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Result } from '../types/models';

export function useResultsForCompetition(competitionId: string | undefined): Result[] {
  return (
    useLiveQuery(async () => {
      if (!competitionId) return [];
      return db.results.where('competitionId').equals(competitionId).toArray();
    }, [competitionId]) ?? []
  );
}

export function useResultsForCompetitor(competitorId: string | undefined): Result[] {
  return (
    useLiveQuery(async () => {
      if (!competitorId) return [];
      return db.results.where('competitorId').equals(competitorId).toArray();
    }, [competitorId]) ?? []
  );
}

export function useAllResults(): Result[] {
  return useLiveQuery(() => db.results.toArray(), [], []) ?? [];
}
