import { boutLabel, type BoutDefinition } from '../../types/models';
import styles from './BoutButton.module.css';

interface BoutButtonProps {
  bout: BoutDefinition;
  value: number | undefined;
  selected: boolean;
  onClick: () => void;
}

export function BoutButton({ bout, value, selected, onClick }: BoutButtonProps) {
  const isFilled = value !== undefined;
  const classes = [
    styles.bout,
    isFilled ? (value === 0 ? styles.filled : styles.filledMiss) : '',
    selected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} onClick={onClick}>
      <span className={styles.label}>{boutLabel(bout)}</span>
      {isFilled && <span className={styles.value}>{value}</span>}
    </button>
  );
}
