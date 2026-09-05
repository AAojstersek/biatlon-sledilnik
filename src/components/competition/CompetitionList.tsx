import { useNavigate } from 'react-router-dom';
import type { Category, Competition, Result } from '../../types/models';
import { formatDate } from '../../utils/format';
import styles from './CompetitionList.module.css';

interface CompetitionListProps {
  competitions: Competition[];
  results: Result[];
  categoriesById: Map<string, Category>;
}

export function CompetitionList({ competitions, results, categoriesById }: CompetitionListProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.list}>
      {competitions.map((competition) => {
        const total = competition.participantIds.length * competition.boutStructure.length;
        const done = results.filter((r) => r.competitionId === competition.id).length;
        const category = categoriesById.get(competition.categoryId);

        return (
          <button
            key={competition.id}
            type="button"
            className={styles.row}
            onClick={() => navigate(`/competitions/${competition.id}`)}
          >
            <div className={styles.topLine}>
              <span className={styles.name}>{competition.name}</span>
              {category && <span className={styles.badge}>{category.label}</span>}
            </div>
            <div className={styles.meta}>
              <span>{formatDate(competition.date)}</span>
              <span className={done === total && total > 0 ? styles.progressDone : ''}>
                {done}/{total} vnesenih
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
