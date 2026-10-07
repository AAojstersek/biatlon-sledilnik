import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { EmptyState } from '../components/common/EmptyState';
import { IconTrophy } from '../components/common/Icon';
import { useCategories } from '../hooks/useCategories';
import { useCompetitions } from '../hooks/useCompetitions';
import { useAllCompetitors } from '../hooks/useCompetitors';
import { competitionYear, computeStandings, hasPointsTable } from '../utils/standings';
import styles from './StandingsPage.module.css';

const ALL_YEARS = 'all';

export function StandingsPage() {
  const categories = useCategories();
  const competitors = useAllCompetitors();

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [year, setYear] = useState(ALL_YEARS);

  const category = categories.find((c) => c.id === selectedCategoryId) ?? categories[0];
  const competitions = useCompetitions(category?.id);

  const years = useMemo(
    () => [...new Set(competitions.map(competitionYear))].sort((a, b) => b.localeCompare(a)),
    [competitions],
  );

  const rows = useMemo(() => {
    const filtered =
      year === ALL_YEARS ? competitions : competitions.filter((c) => competitionYear(c) === year);
    return computeStandings(filtered, competitors, category);
  }, [competitions, competitors, category, year]);

  return (
    <div className={styles.page}>
      <PageHeader title="Lestvica" />
      <div className={styles.filters}>
        <SegmentedControl
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
          value={category?.id ?? ''}
          onChange={(id) => {
            setSelectedCategoryId(id);
            setYear(ALL_YEARS);
          }}
        />
        <select
          className={styles.select}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="Leto"
        >
          <option value={ALL_YEARS}>Vse</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.content}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<IconTrophy size={30} />}
            title="Ni uvrstitev"
            description="Odpri tekmo in vpiši mesta pod Uvrstitve."
          />
        ) : (
          <section className={styles.section}>
            {!hasPointsTable(category) && <p className={styles.hint}>Tabela točk ni nastavljena.</p>}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.numeric}>#</th>
                  <th>Ime</th>
                  <th className={styles.numeric}>Točke</th>
                  <th className={styles.numeric}>Tekme</th>
                  <th className={styles.numeric}>Najb.</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.competitorId} className={row.isChild ? styles.childRow : ''}>
                    <td className={styles.numeric}>{row.rank}.</td>
                    <td className={styles.name}>{row.name}</td>
                    <td className={`${styles.numeric} ${styles.points}`}>{row.points}</td>
                    <td className={styles.numeric}>{row.competitions}</td>
                    <td className={styles.numeric}>{row.bestPlace}.</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.footnote}>Točke po tabeli kategorije. Uredi v Nastavitvah.</p>
          </section>
        )}
      </div>
    </div>
  );
}
