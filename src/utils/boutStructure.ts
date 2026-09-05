import type { BoutDefinition, BoutType } from '../types/models';

export function buildBoutStructure(sequence: BoutType[]): BoutDefinition[] {
  const counts: Record<BoutType, number> = { L: 0, S: 0 };
  return sequence.map((type, order) => {
    counts[type] += 1;
    return { order, type, occurrence: counts[type] };
  });
}

export function sequenceFromStructure(structure: BoutDefinition[]): BoutType[] {
  return [...structure].sort((a, b) => a.order - b.order).map((b) => b.type);
}
