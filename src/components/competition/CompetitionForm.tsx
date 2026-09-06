import { useState } from 'react';
import type { BoutType, Category, Competition } from '../../types/models';
import { sequenceFromStructure } from '../../utils/boutStructure';
import { todayIso } from '../../utils/format';
import { usePresets } from '../../hooks/usePresets';
import { BoutStructureBuilder } from './BoutStructureBuilder';
import { ParticipantPicker } from './ParticipantPicker';
import { Button } from '../common/Button';
import { SegmentedControl } from '../common/SegmentedControl';
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
    startNumbers: Record<string, string>;
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
  const [startNumbers, setStartNumbers] = useState<Record<string, string>>(
    initial?.startNumbers ?? {},
  );

  const canSubmit = categoryId && name.trim() && sequence.length > 0 && participantIds.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const relevantStartNumbers = Object.fromEntries(
      Object.entries(startNumbers).filter(([id, value]) => value && participantIds.includes(id)),
    );
    onSubmit({
      categoryId,
      name: name.trim(),
      date,
      sequence,
      participantIds,
      startNumbers: relevantStartNumbers,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Kategorija</label>
        <SegmentedControl
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
          value={categoryId}
          onChange={(value) => {
            setSelectedCategoryId(value);
            setParticipantIds([]);
          }}
        />
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
          <p className={styles.hint}>
            Ob izbranem tekmovalcu lahko vpišeš štartno številko za to tekmo — pomaga pri
            hitrejšem prepoznavanju med tekmo.
          </p>
          <ParticipantPicker
            categoryId={categoryId}
            selectedIds={participantIds}
            onChange={setParticipantIds}
            startNumbers={startNumbers}
            onStartNumberChange={(id, value) =>
              setStartNumbers((prev) => ({ ...prev, [id]: value }))
            }
          />
        </div>
      )}

      <Button type="submit" disabled={!canSubmit}>
        {submitLabel}
      </Button>
    </form>
  );
}
