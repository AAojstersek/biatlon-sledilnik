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
}
