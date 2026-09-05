import type { BoutType } from '../../types/models';
import type { Stats } from '../../utils/stats';
import { formatPct } from '../../utils/format';
import styles from './PositionBreakdownTable.module.css';

interface PositionBreakdownTableProps {
  byPosition: Record<BoutType, Stats>;
}

const POSITION_LABELS: Record<BoutType, string> = { L: 'Leže', S: 'Stoje' };

export function PositionBreakdownTable({ byPosition }: PositionBreakdownTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Položaj</th>
          <th>Streli</th>
          <th>Zgrešeni</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
        {(['L', 'S'] as BoutType[]).map((type) => (
          <tr key={type}>
            <td>{POSITION_LABELS[type]}</td>
            <td>{byPosition[type].shots}</td>
            <td>{byPosition[type].misses}</td>
            <td className={styles.pct}>{formatPct(byPosition[type].pct)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
