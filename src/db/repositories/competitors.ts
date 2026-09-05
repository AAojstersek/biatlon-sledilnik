import { db } from '../db';
import type { Competitor } from '../../types/models';

export async function addCompetitor(categoryId: string, name: string): Promise<Competitor> {
  const competitor: Competitor = {
    id: crypto.randomUUID(),
    categoryId,
    name: name.trim(),
    isChild: false,
    archived: false,
    createdAt: new Date().toISOString(),
  };
  await db.competitors.add(competitor);
  return competitor;
}

export async function renameCompetitor(id: string, name: string): Promise<void> {
  await db.competitors.update(id, { name: name.trim() });
}

export async function setCompetitorArchived(id: string, archived: boolean): Promise<void> {
  await db.competitors.update(id, { archived });
}
