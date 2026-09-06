import { useState } from 'react';
import { useCompetitors } from '../../hooks/useCompetitors';
import { addCompetitor } from '../../db/repositories/competitors';
import { Button } from '../common/Button';
import { IconCheckCircle } from '../common/Icon';
import styles from './ParticipantPicker.module.css';

interface ParticipantPickerProps {
  categoryId: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  startNumbers: Record<string, string>;
  onStartNumberChange: (competitorId: string, value: string) => void;
}

export function ParticipantPicker({
  categoryId,
  selectedIds,
  onChange,
  startNumbers,
  onStartNumberChange,
}: ParticipantPickerProps) {
  const competitors = useCompetitors(categoryId, false);
  const [newName, setNewName] = useState('');

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    const competitor = await addCompetitor(categoryId, name);
    setNewName('');
    onChange([...selectedIds, competitor.id]);
  }

  return (
    <div>
      <div className={styles.list}>
        {competitors.map((competitor) => {
          const selected = selectedIds.includes(competitor.id);
          return (
            <label key={competitor.id} className={styles.item} onClick={() => toggle(competitor.id)}>
              <span className={styles.name}>{competitor.name}</span>
              {selected && (
                <input
                  className={styles.startNumberInput}
                  placeholder="#"
                  inputMode="numeric"
                  value={startNumbers[competitor.id] ?? ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onStartNumberChange(competitor.id, e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                />
              )}
              <IconCheckCircle
                size={24}
                filled={selected}
                className={styles.checkIcon}
                style={{ color: selected ? 'var(--color-accent)' : 'var(--color-text-faint)' }}
              />
            </label>
          );
        })}
        {competitors.length === 0 && (
          <div className={styles.item}>Ni tekmovalcev — dodaj spodaj.</div>
        )}
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          placeholder="Ime novega tekmovalca"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={handleAdd}>
          Dodaj
        </Button>
      </div>
    </div>
  );
}
