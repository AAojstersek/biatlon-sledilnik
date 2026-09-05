import { db } from './db';

interface DataDump {
  version: 1;
  exportedAt: string;
  categories: unknown[];
  competitors: unknown[];
  competitions: unknown[];
  results: unknown[];
  structurePresets: unknown[];
}

export async function exportData(): Promise<void> {
  const dump: DataDump = {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories: await db.categories.toArray(),
    competitors: await db.competitors.toArray(),
    competitions: await db.competitions.toArray(),
    results: await db.results.toArray(),
    structurePresets: await db.structurePresets.toArray(),
  };

  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `biatlon-podatki-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function isDataDump(value: unknown): value is DataDump {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.categories) &&
    Array.isArray(v.competitors) &&
    Array.isArray(v.competitions) &&
    Array.isArray(v.results) &&
    Array.isArray(v.structurePresets)
  );
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);

  if (!isDataDump(parsed)) {
    throw new Error('Neveljavna oblika datoteke z izvozom podatkov.');
  }

  await db.transaction(
    'rw',
    db.categories,
    db.competitors,
    db.competitions,
    db.results,
    db.structurePresets,
    async () => {
      await db.categories.bulkPut(parsed.categories as never[]);
      await db.competitors.bulkPut(parsed.competitors as never[]);
      await db.competitions.bulkPut(parsed.competitions as never[]);
      await db.results.bulkPut(parsed.results as never[]);
      await db.structurePresets.bulkPut(parsed.structurePresets as never[]);
    },
  );
}
