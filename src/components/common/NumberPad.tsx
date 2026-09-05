import { SHOTS_PER_BOUT } from '../../types/models';
import styles from './NumberPad.module.css';

interface NumberPadProps {
  value: number | undefined;
  onSelect: (value: number) => void;
}

export function NumberPad({ value, onSelect }: NumberPadProps) {
  const numbers = Array.from({ length: SHOTS_PER_BOUT + 1 }, (_, n) => n);

  return (
    <div className={styles.pad}>
      {numbers.map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.key} ${value === n ? styles.keySelected : ''}`}
          onClick={() => onSelect(n)}
          aria-label={`${n} zgrešenih`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
