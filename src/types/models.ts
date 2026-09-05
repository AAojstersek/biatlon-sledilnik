export type CategoryKind = 'son' | 'daughter';

export interface Category {
  id: string;
  kind: CategoryKind;
  label: string;
  createdAt: string;
}

export interface Competitor {
  id: string;
  categoryId: string;
  name: string;
  isChild: boolean;
  archived: boolean;
  createdAt: string;
}

export type BoutType = 'L' | 'S';

export interface BoutDefinition {
  order: number;
  type: BoutType;
  occurrence: number;
}

export interface Competition {
  id: string;
  categoryId: string;
  name: string;
  date: string;
  boutStructure: BoutDefinition[];
  participantIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: string;
  competitionId: string;
  competitorId: string;
  boutOrder: number;
  misses: number;
  updatedAt: string;
}

export interface StructurePreset {
  id: string;
  name: string;
  boutStructure: BoutDefinition[];
}

export const SHOTS_PER_BOUT = 5;

export function boutLabel(bout: BoutDefinition): string {
  return `${bout.type}${bout.occurrence}`;
}
