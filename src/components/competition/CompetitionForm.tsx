import { useState } from 'react';
import type { BoutType, Category, Competition } from '../../types/models';
import { sequenceFromStructure } from '../../utils/boutStructure';
import { todayIso } from '../../utils/format';
import { usePresets } from '../../hooks/usePresets';
import { BoutStructureBuilder } from './BoutStructureBuilder';
import { ParticipantPicker } from './ParticipantPicker';
import { Button } from '../common/Button';
import styles from './CompetitionForm.module.css';

interface CompetitionFormProps {
  categories: Category[];
  initial?: Competition;
  defaultCategoryId?: string;
  onSubmit: (input: {
    categoryId: string;
    name: string;
    date: string;
    sequence: BoutType[];
    participantIds: string[];
  }) => void;
  submitLabel: string;
}

export function CompetitionForm({
  categories,
  initial,
  defaultCategoryId,
  onSubmit,
  submitLabel,
}: CompetitionFormProps) {
  const presets = usePresets();
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initial?.categoryId ?? defaultCategoryId ?? '',
  );
  const categoryId = categories.some((c) => c.id === selectedCategoryId)
    ? selectedCategoryId
    : (categories[0]?.id ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [sequence, setSequence] = useState<BoutType[]>(
    initial ? sequenceFromStructure(initial.boutStructure) : [],
  );
  const [participantIds, setParticipantIds] = useState<string[]>(initial?.participantIds ?? []);

  const canSubmit = categoryId && name.trim() && sequence.length > 0 && participantIds.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ categoryId, name: name.trim(), date, sequence, participantIds });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Kategorija</label>
        <div className={styles.segmented}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.segmentedOption} ${
                categoryId === category.id ? styles.segmentedActive : ''
              }`}
              onClick={() => {
                setSelectedCategoryId(category.id);
                setParticipantIds([]);
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="competition-name">
          Ime tekme
        </label>
        <input
          id="competition-name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="npr. Državno prvenstvo"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="competition-date">
          Datum
        </label>
        <input
          id="competition-date"
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Strukturа strelanj</label>
        <BoutStructureBuilder sequence={sequence} onChange={setSequence} presets={presets} />
      </div>

      {categoryId && (
        <div className={styles.field}>
          <label className={styles.label}>Udeleženci</label>
          <ParticipantPicker
            categoryId={categoryId}
            selectedIds={participantIds}
            onChange={setParticipantIds}
          />
        </div>
      )}

      <Button type="submit" disabled={!canSubmit}>
        {submitLabel}
      </Button>
    </form>
  );
}
