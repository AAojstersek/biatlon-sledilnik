import { db } from '../db';
import type { BoutDefinition, Competition } from '../../types/models';

export interface CompetitionInput {
  categoryId: string;
  name: string;
  date: string;
  boutStructure: BoutDefinition[];
  participantIds: string[];
  startNumbers?: Record<string, string>;
  placements?: Record<string, number>;
  notes?: string;
}

export async function createCompetition(input: CompetitionInput): Promise<Competition> {
  const now = new Date().toISOString();
  const competition: Competition = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await db.competitions.add(competition);
  return competition;
}

export async function updateCompetition(
  id: string,
  input: Partial<CompetitionInput>,
): Promise<void> {
  await db.competitions.update(id, { ...input, updatedAt: new Date().toISOString() });
}

export async function setPlacements(
  id: string,
  placements: Record<string, number>,
): Promise<void> {
  await updateCompetition(id, { placements });
}

export async function deleteCompetition(id: string): Promise<void> {
  await db.transaction('rw', db.competitions, db.results, async () => {
    await db.results.where('competitionId').equals(id).delete();
    await db.competitions.delete(id);
  });
}
