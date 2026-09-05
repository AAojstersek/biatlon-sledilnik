import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { StructurePreset } from '../types/models';

export function usePresets(): StructurePreset[] {
  return useLiveQuery(() => db.structurePresets.toArray(), [], []) ?? [];
}
