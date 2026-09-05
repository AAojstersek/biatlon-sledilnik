import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { LiveEntryGrid } from '../components/competition/LiveEntryGrid';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { useCompetition } from '../hooks/useCompetition';
import { useAllCompetitors } from '../hooks/useCompetitors';
import { useResultsForCompetition } from '../hooks/useResultsForCompetition';
import { deleteCompetition } from '../db/repositories/competitions';
import { formatDate } from '../utils/format';

export function LiveEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const competition = useCompetition(id);
  const allCompetitors = useAllCompetitors();
  const results = useResultsForCompetition(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!competition) {
    return <EmptyState icon="🎯" title="Tekma ne obstaja" />;
  }

  const participants = competition.participantIds
    .map((pid) => allCompetitors.find((c) => c.id === pid))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <PageHeader
        title={competition.name}
        subtitle={formatDate(competition.date)}
        showBack
        onBack={() => navigate('/competitions')}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate(`/competitions/${competition.id}/edit`)}
              aria-label="Uredi tekmo"
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 18,
              }}
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              aria-label="Izbriši tekmo"
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 18,
              }}
            >
              🗑
            </button>
          </>
        }
      />
      <LiveEntryGrid competition={competition} competitors={participants} results={results} />

      {confirmDelete && (
        <ConfirmDialog
          title="Izbriši tekmo?"
          message="Vsi vneseni rezultati za to tekmo bodo trajno izbrisani."
          confirmLabel="Izbriši"
          danger
          onConfirm={async () => {
            await deleteCompetition(competition.id);
            navigate('/competitions');
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
