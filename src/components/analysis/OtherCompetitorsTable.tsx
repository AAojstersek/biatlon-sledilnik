import { useMemo, useState } from 'react';
import { formatPct } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import { IconUsers } from '../common/Icon';
import styles from './OtherCompetitorsTable.module.css';

export interface OtherCompetitorRow {
  competitorId: string;
  name: string;
  competitions: number;
  shots: number;
  misses: number;
  pct: number;
}

type SortKey = 'name' | 'competitions' | 'shots' | 'misses' | 'pct';

interface OtherCompetitorsTableProps {
  rows: OtherCompetitorRow[];
}

export function OtherCompetitorsTable({ rows }: OtherCompetitorsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pct');
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  if (rows.length === 0) {
    return <EmptyState icon={<IconUsers size={30} />} title="Ni podatkov o drugih tekmovalcih" />;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>Ime</th>
          <th className={styles.numeric} onClick={() => handleSort('competitions')}>
            Tekme
          </th>
          <th className={styles.numeric} onClick={() => handleSort('shots')}>
            Streli
          </th>
          <th className={styles.numeric} onClick={() => handleSort('misses')}>
            Zgrešeni
          </th>
          <th className={styles.numeric} onClick={() => handleSort('pct')}>
            %
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.competitorId}>
            <td>{row.name}</td>
            <td className={styles.numeric}>{row.competitions}</td>
            <td className={styles.numeric}>{row.shots}</td>
            <td className={styles.numeric}>{row.misses}</td>
            <td className={`${styles.numeric} ${styles.pct}`}>{formatPct(row.pct)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
