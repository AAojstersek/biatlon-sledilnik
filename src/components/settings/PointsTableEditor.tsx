import { useEffect, useState } from 'react';
import type { Category } from '../../types/models';
import { setPointsTable } from '../../db/repositories/categories';
import { parsePoints } from '../../utils/standings';
import { SegmentedControl } from '../common/SegmentedControl';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Button } from '../common/Button';
import { AddButton, DeleteButton } from '../common/ListActions';
import styles from './PointsTableEditor.module.css';

interface PointsTableEditorProps {
  categories: Category[];
}

interface Draft {
  places: string[];
  others: string;
}

function toDraft(category: Category | undefined): Draft {
  return {
    places: (category?.pointsByPlace ?? []).map(String),
    others: String(category?.pointsForOtherPlaces ?? 0),
  };
}

export function PointsTableEditor({ categories }: PointsTableEditorProps) {
  const [selectedId, setSelectedId] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const category = categories.find((c) => c.id === selectedId) ?? categories[0];
  const saved = toDraft(category);
  const { places: values, others } = draft ?? saved;
  const setValues = (places: string[]) => setDraft({ places, others });

  useEffect(() => {
    if (!savedVisible) return;
    const timer = setTimeout(() => setSavedVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [savedVisible]);

  if (!category) return null;

  const parsed = values.map(parsePoints);
  const parsedOthers = parsePoints(others);
  const hasInvalid = parsed.some((v) => v === undefined) || parsedOthers === undefined;
  const isDirty =
    others !== saved.others ||
    values.length !== saved.places.length ||
    values.some((v, i) => v !== saved.places[i]);

  function switchTo(id: string) {
    setSelectedId(id);
    setDraft(null);
    setPendingId(null);
  }

  function handleCategoryChange(id: string) {
    if (id === category!.id) return;
    if (isDirty) setPendingId(id);
    else switchTo(id);
  }

  async function handleSave() {
    if (hasInvalid || !isDirty) return;
    const points = parsed as number[];
    await setPointsTable(category!.id, points, parsedOthers!);
    // Keep a normalised draft: once the live query catches up it equals the saved table.
    setDraft({ places: points.map(String), others: String(parsedOthers) });
    setSavedVisible(true);
  }

  return (
    <>
      <SegmentedControl
        options={categories.map((c) => ({ value: c.id, label: c.label }))}
        value={category.id}
        onChange={handleCategoryChange}
      />

      {values.length === 0 ? (
        <p className={styles.empty}>Ni nastavljenih točk po mestih – vsa mesta prinesejo točke za ostala mesta.</p>
      ) : (
        <div className={styles.list}>
          {values.map((value, i) => (
            <div key={i} className={styles.item}>
              <span className={styles.place}>{i + 1}. mesto</span>
              <div className={styles.itemRight}>
                <input
                  className={`${styles.input} ${parsed[i] === undefined ? styles.inputInvalid : ''}`}
                  inputMode="numeric"
                  aria-label={`Točke za ${i + 1}. mesto`}
                  value={value}
                  onChange={(e) =>
                    setValues(values.map((v, j) => (j === i ? e.target.value : v)))
                  }
                />
                {i === values.length - 1 ? (
                  <DeleteButton
                    label="Odstrani zadnje mesto"
                    onDelete={() => setValues(values.slice(0, -1))}
                  />
                ) : (
                  <span className={styles.iconSpacer} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddButton onClick={() => setValues([...values, ''])}>Dodaj mesto</AddButton>

      <div className={styles.item}>
        <span className={styles.place}>Ostala mesta</span>
        <div className={styles.itemRight}>
          <input
            className={`${styles.input} ${parsedOthers === undefined ? styles.inputInvalid : ''}`}
            inputMode="numeric"
            aria-label="Točke za ostala mesta"
            value={others}
            onChange={(e) => setDraft({ places: values, others: e.target.value })}
          />
          <span className={styles.iconSpacer} />
        </div>
      </div>

      <div className={styles.saveRow}>
        <Button
          type="button"
          disabled={hasInvalid || !isDirty}
          onClick={handleSave}
        >
          Shrani tabelo
        </Button>
        {savedVisible && <span className={styles.saved}>Shranjeno</span>}
      </div>

      {pendingId && (
        <ConfirmDialog
          title="Zavrži spremembe?"
          message="Neshranjene spremembe tabele točk bodo izgubljene."
          confirmLabel="Zavrži"
          danger
          onConfirm={() => switchTo(pendingId)}
          onCancel={() => setPendingId(null)}
        />
      )}
    </>
  );
}
