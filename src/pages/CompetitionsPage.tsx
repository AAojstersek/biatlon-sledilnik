import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { CompetitionList } from '../components/competition/CompetitionList';
import { EmptyState } from '../components/common/EmptyState';
import { useCategories } from '../hooks/useCategories';
import { useCompetitions } from '../hooks/useCompetitions';
import { useAllResults } from '../hooks/useResultsForCompetition';
import styles from './CompetitionsPage.module.css';

export function CompetitionsPage() {
  const navigate = useNavigate();
  const categories = useCategories();
  const [filter, setFilter] = useState<string>('all');
  const competitions = useCompetitions(filter === 'all' ? undefined : filter);
  const results = useAllResults();

  const categoriesById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  return (
    <div className={styles.page}>
      <PageHeader title="Tekme" />
      <div className={styles.filterRow}>
        <button
          type="button"
          className={`${styles.filterChip} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          Vse
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`${styles.filterChip} ${filter === category.id ? styles.filterActive : ''}`}
            onClick={() => setFilter(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {competitions.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="Ni še nobene tekme"
            description="Dodaj prvo tekmo s spodnjim gumbom."
          />
        ) : (
          <CompetitionList
            competitions={competitions}
            results={results}
            categoriesById={categoriesById}
          />
        )}
      </div>
      <button
        type="button"
        className={styles.fab}
        onClick={() => navigate('/competitions/new')}
        aria-label="Nova tekma"
      >
        +
      </button>
    </div>
  );
}
