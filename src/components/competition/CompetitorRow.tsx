import type { BoutDefinition } from '../../types/models';
import { BoutButton } from './BoutButton';
import styles from './CompetitorRow.module.css';

interface CompetitorRowProps {
  name: string;
  isChild: boolean;
  boutStructure: BoutDefinition[];
  valuesByBoutOrder: Map<number, number>;
  selectedBoutOrder: number | undefined;
  onSelectBout: (order: number) => void;
}

export function CompetitorRow({
  name,
  isChild,
  boutStructure,
  valuesByBoutOrder,
  selectedBoutOrder,
  onSelectBout,
}: CompetitorRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.name}>
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
