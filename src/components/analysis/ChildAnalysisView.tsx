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
import { IconPerson } from '../common/Icon';
import { SegmentedControl } from '../common/SegmentedControl';
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
    return <EmptyState icon={<IconPerson size={30} />} title="Ni nastavljenega otroka v tej kategoriji" />;
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
          <SegmentedControl
            options={[
              { value: 'time', label: 'Skozi čas' },
              { value: 'competition', label: 'Ena tekma' },
            ]}
            value={comparisonMode}
            onChange={(v) => setComparisonMode(v as 'time' | 'competition')}
          />
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
