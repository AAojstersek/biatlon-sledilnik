import { db } from '../db';
import type { BoutDefinition, StructurePreset } from '../../types/models';

export async function addPreset(name: string, boutStructure: BoutDefinition[]): Promise<StructurePreset> {
  const preset: StructurePreset = {
    id: crypto.randomUUID(),
    name: name.trim(),
    boutStructure,
  };
  await db.structurePresets.add(preset);
  return preset;
}

export async function deletePreset(id: string): Promise<void> {
  await db.structurePresets.delete(id);
}
