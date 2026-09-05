import { SHOTS_PER_BOUT, type BoutType, type Competition, type Result } from '../types/models';

export interface Stats {
  shots: number;
  misses: number;
  hits: number;
  pct: number;
}

function toStats(shots: number, misses: number): Stats {
  const hits = shots - misses;
  return { shots, misses, hits, pct: shots > 0 ? (hits / shots) * 100 : 0 };
}

export function computeOverallStats(results: Result[]): Stats {
  const shots = results.length * SHOTS_PER_BOUT;
  const misses = results.reduce((sum, r) => sum + r.misses, 0);
  return toStats(shots, misses);
}

function boutTypeLookup(competitions: Competition[]): Map<string, BoutType> {
  const map = new Map<string, BoutType>();
  for (const c of competitions) {
    for (const bout of c.boutStructure) {
      map.set(`${c.id}:${bout.order}`, bout.type);
    }
  }
  return map;
}

export function computeByPosition(
  results: Result[],
  competitions: Competition[],
): Record<BoutType, Stats> {
  const lookup = boutTypeLookup(competitions);
  const byType: Record<BoutType, Result[]> = { L: [], S: [] };

  for (const r of results) {
    const type = lookup.get(`${r.competitionId}:${r.boutOrder}`);
    if (type) byType[type].push(r);
  }

  return {
    L: computeOverallStats(byType.L),
    S: computeOverallStats(byType.S),
  };
}

export interface TrendPoint {
  competitionId: string;
  competitionName: string;
  date: string;
  overall: Stats;
  L: Stats;
  S: Stats;
}

export function computeTrend(
  competitorId: string,
  competitions: Competition[],
  results: Result[],
): TrendPoint[] {
  const byCompetitor = results.filter((r) => r.competitorId === competitorId);
  const resultsByCompetition = new Map<string, Result[]>();
  for (const r of byCompetitor) {
    const list = resultsByCompetition.get(r.competitionId) ?? [];
    list.push(r);
    resultsByCompetition.set(r.competitionId, list);
  }

  const points: TrendPoint[] = [];
  for (const c of competitions) {
    const compResults = resultsByCompetition.get(c.id);
    if (!compResults || compResults.length === 0) continue;
    const byPosition = computeByPosition(compResults, [c]);
    points.push({
      competitionId: c.id,
      competitionName: c.name,
      date: c.date,
      overall: computeOverallStats(compResults),
      L: byPosition.L,
      S: byPosition.S,
    });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

export interface ComparisonRow {
  competitorId: string;
  name: string;
  stats: Stats;
}

export function computeComparison(
  competitionId: string | null,
  competitors: { id: string; name: string }[],
  results: Result[],
): ComparisonRow[] {
  const filtered = competitionId
    ? results.filter((r) => r.competitionId === competitionId)
    : results;

  return competitors
    .map((competitor) => {
      const compResults = filtered.filter((r) => r.competitorId === competitor.id);
      return {
        competitorId: competitor.id,
        name: competitor.name,
        stats: computeOverallStats(compResults),
      };
    })
    .filter((row) => row.stats.shots > 0);
}
