import type { Stats } from '../../utils/stats';
import { formatPct } from '../../utils/format';
import styles from './SummaryStatsCard.module.css';

interface SummaryStatsCardProps {
  stats: Stats;
}

export function SummaryStatsCard({ stats }: SummaryStatsCardProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.tile}>
        <span className={styles.value}>{stats.shots}</span>
        <span className={styles.label}>strelov</span>
      </div>
      <div className={styles.tile}>
        <span className={styles.value}>{stats.misses}</span>
        <span className={styles.label}>zgrešenih</span>
      </div>
      <div className={styles.tile}>
        <span className={`${styles.value} ${styles.accent}`}>{formatPct(stats.pct)}</span>
        <span className={styles.label}>uspešnost</span>
      </div>
    </div>
  );
}
