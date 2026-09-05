import { useMemo, useState } from 'react';
import { useCompetitors } from '../../hooks/useCompetitors';
import { useCompetitions } from '../../hooks/useCompetitions';
import { useAllResults } from '../../hooks/useResultsForCompetition';
import {
  computeByPosition,
  computeComparison,
  computeOverallStats,
  computeTrend,
} from '../../utils/stats';
import { SummaryStatsCard } from './SummaryStatsCard';
import { TrendChart } from './TrendChart';
import { PositionBreakdownTable } from './PositionBreakdownTable';
import { ComparisonChart } from './ComparisonChart';
import { EmptyState } from '../common/EmptyState';
import { formatDate } from '../../utils/format';
import styles from './ChildAnalysisView.module.css';

interface ChildAnalysisViewProps {
  categoryId: string;
}

export function ChildAnalysisView({ categoryId }: ChildAnalysisViewProps) {
  const competitors = useCompetitors(categoryId, true);
  const competitions = useCompetitions(categoryId);
  const allResults = useAllResults();

  const [comparisonMode, setComparisonMode] = useState<'time' | 'competition'>('time');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>('');

  const child = competitors.find((c) => c.isChild);

  const competitionIds = useMemo(() => new Set(competitions.map((c) => c.id)), [competitions]);
  const resultsInCategory = useMemo(
    () => allResults.filter((r) => competitionIds.has(r.competitionId)),
    [allResults, competitionIds],
  );

  if (!child) {
    return <EmptyState icon="🙋" title="Ni nastavljenega otroka v tej kategoriji" />;
  }

  const childResults = resultsInCategory.filter((r) => r.competitorId === child.id);
  const overall = computeOverallStats(childResults);
  const byPosition = computeByPosition(childResults, competitions);
  const trend = computeTrend(child.id, competitions, resultsInCategory);

  const activeCompetitionId =
    selectedCompetitionId || competitions[0]?.id || '';

  const comparisonRows = computeComparison(
    comparisonMode === 'competition' ? activeCompetitionId : null,
    competitors,
    resultsInCategory,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Skupno</div>
        <SummaryStatsCard stats={overall} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Trend uspešnosti</div>
        <TrendChart points={trend} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Po položaju</div>
        <PositionBreakdownTable byPosition={byPosition} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Primerjava s sotekmovalci</div>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${comparisonMode === 'time' ? styles.toggleActive : ''}`}
            onClick={() => setComparisonMode('time')}
          >
            Skozi čas
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${
              comparisonMode === 'competition' ? styles.toggleActive : ''
            }`}
            onClick={() => setComparisonMode('competition')}
          >
            Ena tekma
          </button>
          {comparisonMode === 'competition' && (
            <select
              className={styles.select}
              value={activeCompetitionId}
              onChange={(e) => setSelectedCompetitionId(e.target.value)}
            >
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({formatDate(c.date)})
                </option>
              ))}
            </select>
          )}
        </div>
        <ComparisonChart rows={comparisonRows} highlightId={child.id} />
      </section>
    </div>
  );
}
