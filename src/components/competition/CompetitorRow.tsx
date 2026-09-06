import type { BoutDefinition } from '../../types/models';
import { BoutButton } from './BoutButton';
import styles from './CompetitorRow.module.css';

interface CompetitorRowProps {
  name: string;
  isChild: boolean;
  startNumber?: string;
  boutStructure: BoutDefinition[];
  valuesByBoutOrder: Map<number, number>;
  selectedBoutOrder: number | undefined;
  onSelectBout: (order: number) => void;
}

export function CompetitorRow({
  name,
  isChild,
  startNumber,
  boutStructure,
  valuesByBoutOrder,
  selectedBoutOrder,
  onSelectBout,
}: CompetitorRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.name}>
        {startNumber && <span className={styles.bib}>{startNumber}</span>}
        {name}
        {isChild && <span className={styles.childBadge}>otrok</span>}
      </div>
      <div className={styles.bouts}>
        {boutStructure.map((bout) => (
          <BoutButton
            key={bout.order}
            bout={bout}
            value={valuesByBoutOrder.get(bout.order)}
            selected={selectedBoutOrder === bout.order}
            onClick={() => onSelectBout(bout.order)}
          />
        ))}
      </div>
    </div>
  );
}
