export type CategoryKind = 'son' | 'daughter';

export interface Category {
  id: string;
  kind: CategoryKind;
  label: string;
  /** Points awarded per finishing place: index 0 = 1st place. Places beyond the table score 0. */
  pointsByPlace?: number[];
  /** Points for any place beyond pointsByPlace. Missing = 0. */
  pointsForOtherPlaces?: number;
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
  /** Bib/start numbers, keyed by competitorId. Specific to this one competition only —
   *  numbers are reassigned every competition, unlike the competitor's identity. */
  startNumbers?: Record<string, string>;
  /** Finishing place (1 = winner), keyed by competitorId. Missing key = no placement. */
  placements?: Record<string, number>;
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
