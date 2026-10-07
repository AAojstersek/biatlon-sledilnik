import type { Category, Competition, Competitor } from '../types/models';

export type PointsTable = Pick<Category, 'pointsByPlace' | 'pointsForOtherPlaces'>;

export function pointsForPlace(place: number, table: PointsTable | undefined): number {
  return table?.pointsByPlace?.[place - 1] ?? table?.pointsForOtherPlaces ?? 0;
}

export function hasPointsTable(table: PointsTable | undefined): boolean {
  return (table?.pointsByPlace?.length ?? 0) > 0 || (table?.pointsForOtherPlaces ?? 0) > 0;
}

/** Parses a place typed by the user. Empty → null, invalid → undefined. */
export function parsePlace(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return undefined;
  const n = Number(trimmed);
  return n >= 1 ? n : undefined;
}

/** Parses points typed by the user. Empty or invalid → undefined. */
export function parsePoints(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return undefined;
  return Number(trimmed);
}

/** Placements of a competition, restricted to its current participants. */
export function validPlacements(competition: Competition): [string, number][] {
  const placements = competition.placements ?? {};
  return competition.participantIds
    .filter((id) => Number.isInteger(placements[id]) && placements[id] >= 1)
    .map((id) => [id, placements[id]]);
}

export function competitionYear(competition: Competition): string {
  return competition.date.slice(0, 4);
}

export interface StandingRow {
  competitorId: string;
  name: string;
  isChild: boolean;
  points: number;
  competitions: number;
  bestPlace: number;
  rank: number;
  /** Sorted finishing places, best first — used for count-back tie-breaking. */
  places: number[];
}

function compareCountBack(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const pa = a[i] ?? Infinity;
    const pb = b[i] ?? Infinity;
    if (pa !== pb) return pa - pb;
  }
  return 0;
}

export function computeStandings(
  competitions: Competition[],
  competitors: Competitor[],
  table: PointsTable | undefined,
): StandingRow[] {
  const byId = new Map(competitors.map((c) => [c.id, c]));
  const acc = new Map<string, { points: number; places: number[] }>();

  for (const competition of competitions) {
    for (const [competitorId, place] of validPlacements(competition)) {
      if (!byId.has(competitorId)) continue;
      const entry = acc.get(competitorId) ?? { points: 0, places: [] };
      entry.points += pointsForPlace(place, table);
      entry.places.push(place);
      acc.set(competitorId, entry);
    }
  }

  const rows: StandingRow[] = [...acc.entries()].map(([competitorId, { points, places }]) => {
    const competitor = byId.get(competitorId)!;
    const sortedPlaces = [...places].sort((a, b) => a - b);
    return {
      competitorId,
      name: competitor.name,
      isChild: competitor.isChild,
      points,
      competitions: places.length,
      bestPlace: sortedPlaces[0],
      rank: 0,
      places: sortedPlaces,
    };
  });

  // Points desc, then count-back (more 1st places, then more 2nd places, …), then name.
  const tieCompare = (a: StandingRow, b: StandingRow) =>
    b.points - a.points || compareCountBack(a.places, b.places);
  rows.sort((a, b) => tieCompare(a, b) || a.name.localeCompare(b.name));

  rows.forEach((row, i) => {
    row.rank = i > 0 && tieCompare(rows[i - 1], row) === 0 ? rows[i - 1].rank : i + 1;
  });

  return rows;
}
