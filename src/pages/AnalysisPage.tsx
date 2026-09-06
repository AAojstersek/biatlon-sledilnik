import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ChildAnalysisView } from '../components/analysis/ChildAnalysisView';
import { OtherCompetitorsTable, type OtherCompetitorRow } from '../components/analysis/OtherCompetitorsTable';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { useCategories } from '../hooks/useCategories';
import { useAllCompetitors } from '../hooks/useCompetitors';
import { useAllResults } from '../hooks/useResultsForCompetition';
import { computeOverallStats } from '../utils/stats';
import styles from './AnalysisPage.module.css';

type Tab = { kind: 'category'; categoryId: string; label: string } | { kind: 'others'; label: string };

export function AnalysisPage() {
  const categories = useCategories();
  const competitors = useAllCompetitors();
  const results = useAllResults();

  const tabs: (Tab & { key: string })[] = [
    ...categories.map((c) => ({ kind: 'category' as const, categoryId: c.id, label: c.label, key: c.id })),
    { kind: 'others' as const, label: 'Drugi', key: 'others' },
  ];

  const [activeKey, setActiveKey] = useState('');
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  const otherRows: OtherCompetitorRow[] = useMemo(() => {
    const others = competitors.filter((c) => !c.isChild);
    return others
      .map((competitor) => {
        const own = results.filter((r) => r.competitorId === competitor.id);
        const stats = computeOverallStats(own);
        const competitionCount = new Set(own.map((r) => r.competitionId)).size;
        return {
          competitorId: competitor.id,
          name: competitor.name,
          competitions: competitionCount,
          shots: stats.shots,
          misses: stats.misses,
          pct: stats.pct,
        };
      })
      .filter((row) => row.shots > 0);
  }, [competitors, results]);

  return (
    <div className={styles.page}>
      <PageHeader title="Analiza" />
      <div className={styles.tabs}>
        <SegmentedControl
          options={tabs.map((t) => ({ value: t.key, label: t.label }))}
          value={active?.key ?? ''}
          onChange={setActiveKey}
        />
      </div>
      <div className={styles.content}>
        {active?.kind === 'category' ? (
          <ChildAnalysisView categoryId={active.categoryId} />
        ) : (
          <OtherCompetitorsTable rows={otherRows} />
        )}
      </div>
    </div>
  );
}
