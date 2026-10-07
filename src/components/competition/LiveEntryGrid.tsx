import { useMemo, useState } from 'react';
import type { Competition, Competitor, Result } from '../../types/models';
import { setResult } from '../../db/repositories/results';
import { sortByStartNumber } from '../../utils/startNumbers';
import { CompetitorRow } from './CompetitorRow';
import { NumberPad } from '../common/NumberPad';
import { EmptyState } from '../common/EmptyState';
import { IconPerson } from '../common/Icon';
import styles from './LiveEntryGrid.module.css';

interface LiveEntryGridProps {
  competition: Competition;
  competitors: Competitor[];
  results: Result[];
}

interface Selection {
  competitorId: string;
  boutOrder: number;
}

export function LiveEntryGrid({ competition, competitors, results }: LiveEntryGridProps) {
  const [selection, setSelection] = useState<Selection | null>(null);

  const valuesByCompetitor = useMemo(() => {
    const map = new Map<string, Map<number, number>>();
    for (const r of results) {
      if (!map.has(r.competitorId)) map.set(r.competitorId, new Map());
      map.get(r.competitorId)!.set(r.boutOrder, r.misses);
    }
    return map;
  }, [results]);

  const sortedBouts = useMemo(
    () => [...competition.boutStructure].sort((a, b) => a.order - b.order),
    [competition.boutStructure],
  );

  const sortedCompetitors = useMemo(
    () => sortByStartNumber(competitors, competition.startNumbers),
    [competitors, competition.startNumbers],
  );

  function nextEmptyBout(competitorId: string, afterOrder: number): number | null {
    const values = valuesByCompetitor.get(competitorId);
    const remaining = sortedBouts.filter(
      (b) => b.order > afterOrder && !values?.has(b.order),
    );
    return remaining.length > 0 ? remaining[0].order : null;
  }

  async function handleNumberSelect(value: number) {
    if (!selection) return;
    const { competitorId, boutOrder } = selection;
    await setResult(competition.id, competitorId, boutOrder, value);

    const next = nextEmptyBout(competitorId, boutOrder);
    setSelection(next !== null ? { competitorId, boutOrder: next } : null);
  }

  if (competitors.length === 0) {
    return (
      <EmptyState
        icon={<IconPerson size={30} />}
        title="Ni izbranih tekmovalcev"
        description="Uredi tekmo in dodaj udeležence za vnos rezultatov."
      />
    );
  }

  const selectedValue = selection
    ? valuesByCompetitor.get(selection.competitorId)?.get(selection.boutOrder)
    : undefined;

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.card}>
          {sortedCompetitors.map((competitor) => (
            <CompetitorRow
              key={competitor.id}
              name={competitor.name}
              isChild={competitor.isChild}
              startNumber={competition.startNumbers?.[competitor.id]}
              boutStructure={sortedBouts}
              valuesByBoutOrder={valuesByCompetitor.get(competitor.id) ?? new Map()}
              selectedBoutOrder={
                selection?.competitorId === competitor.id ? selection.boutOrder : undefined
              }
              onSelectBout={(order) => setSelection({ competitorId: competitor.id, boutOrder: order })}
            />
          ))}
        </div>
      </div>
      {selection ? (
        <div className={styles.padDock}>
          <NumberPad value={selectedValue} onSelect={handleNumberSelect} />
        </div>
      ) : (
        <div className={styles.hint}>Tapni polje strelanja za vnos zgrešenih</div>
      )}
    </div>
  );
}
