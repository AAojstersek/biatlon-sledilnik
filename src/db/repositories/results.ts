import { db } from '../db';

export async function setResult(
  competitionId: string,
  competitorId: string,
  boutOrder: number,
  misses: number,
): Promise<void> {
  const existing = await db.results
    .where('[competitionId+competitorId]')
    .equals([competitionId, competitorId])
    .filter((r) => r.boutOrder === boutOrder)
    .first();

  const now = new Date().toISOString();

  if (existing) {
    await db.results.update(existing.id, { misses, updatedAt: now });
  } else {
    await db.results.add({
      id: crypto.randomUUID(),
      competitionId,
      competitorId,
      boutOrder,
      misses,
      updatedAt: now,
    });
  }
}
