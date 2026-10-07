import { db } from './db';
import type { BoutDefinition } from '../types/models';

const sprint: BoutDefinition[] = [
  { order: 0, type: 'L', occurrence: 1 },
  { order: 1, type: 'S', occurrence: 1 },
];

const pursuit: BoutDefinition[] = [
  { order: 0, type: 'L', occurrence: 1 },
  { order: 1, type: 'S', occurrence: 1 },
  { order: 2, type: 'L', occurrence: 2 },
  { order: 3, type: 'S', occurrence: 2 },
];

/** Official points table (1st → 40 … 19th → 2, any other place → 1). */
export const DEFAULT_POINTS_BY_PLACE = [40, 30, 24, 20, 18, 16, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
export const DEFAULT_POINTS_FOR_OTHER_PLACES = 1;

export async function seedDatabase(): Promise<void> {
  await db.transaction('rw', db.categories, db.competitors, async () => {
    const categoryCount = await db.categories.count();
    if (categoryCount > 0) return;

    const now = new Date().toISOString();
    const sonId = crypto.randomUUID();
    const daughterId = crypto.randomUUID();

    await db.categories.bulkAdd([
      { id: sonId, kind: 'son', label: 'Izak', createdAt: now },
      { id: daughterId, kind: 'daughter', label: 'Zala', createdAt: now },
    ]);

    await db.competitors.bulkAdd([
      {
        id: crypto.randomUUID(),
        categoryId: sonId,
        name: 'Izak',
        isChild: true,
        archived: false,
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        categoryId: daughterId,
        name: 'Zala',
        isChild: true,
        archived: false,
        createdAt: now,
      },
    ]);
  });

  await db.transaction('rw', db.structurePresets, async () => {
    const presetCount = await db.structurePresets.count();
    if (presetCount > 0) return;

    await db.structurePresets.bulkAdd([
      { id: crypto.randomUUID(), name: 'Šprint', boutStructure: sprint },
      { id: crypto.randomUUID(), name: 'Zasledovanje', boutStructure: pursuit },
      { id: crypto.randomUUID(), name: 'Posamično', boutStructure: pursuit },
      { id: crypto.randomUUID(), name: 'Skupinski start', boutStructure: pursuit },
    ]);
  });

  await prefillPointsTables();
}

/** Gives categories that never had a points table saved the default one. A table the user
 *  saved (even an empty one) is left untouched. */
export async function prefillPointsTables(): Promise<void> {
  await db.transaction('rw', db.categories, async () => {
    const withoutTable = await db.categories.filter((c) => c.pointsByPlace === undefined).toArray();
    for (const category of withoutTable) {
      await db.categories.update(category.id, {
        pointsByPlace: DEFAULT_POINTS_BY_PLACE,
        pointsForOtherPlaces: DEFAULT_POINTS_FOR_OTHER_PLACES,
      });
    }
  });
}
