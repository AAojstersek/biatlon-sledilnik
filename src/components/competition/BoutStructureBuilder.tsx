import type { BoutType, StructurePreset } from '../../types/models';
import { buildBoutStructure } from '../../utils/boutStructure';
import { Button } from '../common/Button';
import { IconPlus, IconX } from '../common/Icon';
import styles from './BoutStructureBuilder.module.css';

interface BoutStructureBuilderProps {
  sequence: BoutType[];
  onChange: (sequence: BoutType[]) => void;
  presets: StructurePreset[];
}

export function BoutStructureBuilder({ sequence, onChange, presets }: BoutStructureBuilderProps) {
  const structure = buildBoutStructure(sequence);

  function addBout(type: BoutType) {
    onChange([...sequence, type]);
  }

  function removeAt(index: number) {
    onChange(sequence.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.section}>
      {presets.length > 0 && (
        <div className={styles.presetRow}>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.presetChip}
              onClick={() => onChange(preset.boutStructure.map((b) => b.type))}
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      <div className={styles.sequence}>
        {structure.length === 0 && <span className={styles.hint}>Dodaj vsaj eno strelanje.</span>}
        {structure.map((bout, index) => (
          <span key={index} className={styles.chip}>
            {bout.type}
            {bout.occurrence}
            <button
              type="button"
              className={styles.chipRemove}
              onClick={() => removeAt(index)}
              aria-label="Odstrani"
            >
              <IconX size={13} strokeWidth={2.3} />
            </button>
          </span>
        ))}
      </div>

      <div className={styles.addRow}>
        <Button type="button" variant="secondary" onClick={() => addBout('L')}>
          <IconPlus size={16} strokeWidth={2.2} />
          Leže
        </Button>
        <Button type="button" variant="secondary" onClick={() => addBout('S')}>
          <IconPlus size={16} strokeWidth={2.2} />
          Stoje
        </Button>
      </div>
    </div>
  );
}
