import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { IconPerson, IconTarget } from '../components/common/Icon';
import { useCompetition } from '../hooks/useCompetition';
import { useAllCompetitors } from '../hooks/useCompetitors';
import { useCategories } from '../hooks/useCategories';
import { setPlacements } from '../db/repositories/competitions';
import { hasPointsTable, parsePlace, pointsForPlace } from '../utils/standings';
import { sortByStartNumber } from '../utils/startNumbers';
import styles from './PlacementsPage.module.css';

export function PlacementsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const competition = useCompetition(id);
  const allCompetitors = useAllCompetitors();
  const categories = useCategories();

  // null until the user edits; until then the saved placements are shown.
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const initial = useMemo(() => {
    const placements = competition?.placements ?? {};
    const values: Record<string, string> = {};
    for (const pid of competition?.participantIds ?? []) {
      values[pid] = placements[pid] !== undefined ? String(placements[pid]) : '';
    }
    return values;
  }, [competition]);

  if (!competition) {
    return <EmptyState icon={<IconTarget size={30} />} title="Tekma ne obstaja" />;
  }

  const values = draft ?? initial;
  const backToCompetition = () => navigate(`/competitions/${competition.id}`);

  const participants = sortByStartNumber(
    competition.participantIds
      .map((pid) => allCompetitors.find((c) => c.id === pid))
      .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    competition.startNumbers,
  );

  const pointsTable = categories.find((c) => c.id === competition.categoryId);

  const parsed = Object.fromEntries(
    participants.map((p) => [p.id, parsePlace(values[p.id] ?? '')]),
  );
  const hasInvalid = Object.values(parsed).some((v) => v === undefined);

  const placeCounts = new Map<number, number>();
  for (const v of Object.values(parsed)) {
    if (typeof v === 'number') placeCounts.set(v, (placeCounts.get(v) ?? 0) + 1);
  }
  const isDuplicate = (v: number | null | undefined) =>
    typeof v === 'number' && (placeCounts.get(v) ?? 0) > 1;
  const hasDuplicates = [...placeCounts.values()].some((n) => n > 1);

  const isDirty = participants.some((p) => (values[p.id] ?? '') !== (initial[p.id] ?? ''));

  function handleBack() {
    if (isDirty) setConfirmDiscard(true);
    else backToCompetition();
  }

  async function handleSave() {
    if (hasInvalid || saving) return;
    setSaving(true);
    const placements: Record<string, number> = {};
    for (const p of participants) {
      const v = parsed[p.id];
      if (typeof v === 'number') placements[p.id] = v;
    }
    await setPlacements(competition!.id, placements);
    backToCompetition();
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Uvrstitve" subtitle={competition.name} showBack onBack={handleBack} />

      {participants.length === 0 ? (
        <EmptyState
          icon={<IconPerson size={30} />}
          title="Ni izbranih tekmovalcev"
          description="Uredi tekmo in dodaj udeležence."
        />
      ) : (
        <div className={styles.content}>
          {!hasPointsTable(pointsTable) && (
            <p className={styles.hint}>
              Tabela točk za to kategorijo ni nastavljena – vse uvrstitve prinesejo 0 točk.
            </p>
          )}

          <div className={styles.card}>
            {participants.map((p) => {
              const v = parsed[p.id];
              const invalid = v === undefined;
              const duplicate = isDuplicate(v);
              const startNumber = competition.startNumbers?.[p.id];
              return (
                <div
                  key={p.id}
                  className={`${styles.row} ${duplicate ? styles.rowDuplicate : ''}`}
                >
                  <div className={styles.rowMain}>
                    <div className={styles.name}>
                      {startNumber && <span className={styles.bib}>{startNumber}</span>}
                      {p.name}
                      {p.isChild && <span className={styles.childBadge}>otrok</span>}
                    </div>
                    <div className={styles.placeField}>
                      {typeof v === 'number' && (
                        <span className={styles.points}>
                          {pointsForPlace(v, pointsTable)} t.
                        </span>
                      )}
                      <input
                        className={`${styles.placeInput} ${invalid ? styles.inputInvalid : ''}`}
                        inputMode="numeric"
                        placeholder="–"
                        aria-label={`Mesto – ${p.name}`}
                        value={values[p.id] ?? ''}
                        onChange={(e) =>
                          setDraft({ ...values, [p.id]: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  {invalid && <div className={styles.error}>Vpiši celo število od 1 naprej</div>}
                </div>
              );
            })}
          </div>

          {hasDuplicates && (
            <p className={styles.warning}>Isto mesto ima več tekmovalcev</p>
          )}

          <Button type="button" fullWidth disabled={hasInvalid || saving} onClick={handleSave}>
            Shrani
          </Button>
        </div>
      )}

      {confirmDiscard && (
        <ConfirmDialog
          title="Zavrži spremembe?"
          message="Neshranjena mesta bodo izgubljena."
          confirmLabel="Zavrži"
          danger
          onConfirm={backToCompetition}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </div>
  );
}
