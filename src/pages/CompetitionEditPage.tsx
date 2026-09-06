import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { CompetitionForm } from '../components/competition/CompetitionForm';
import { useCategories } from '../hooks/useCategories';
import { useCompetition } from '../hooks/useCompetition';
import { createCompetition, updateCompetition } from '../db/repositories/competitions';
import { buildBoutStructure } from '../utils/boutStructure';
import type { BoutType } from '../types/models';

export function CompetitionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categories = useCategories();
  const existing = useCompetition(id);
  const isEdit = Boolean(id);

  if (isEdit && !existing) {
    return <PageHeader title="Nalaganje..." />;
  }

  async function handleSubmit(input: {
    categoryId: string;
    name: string;
    date: string;
    sequence: BoutType[];
    participantIds: string[];
    startNumbers: Record<string, string>;
  }) {
    const boutStructure = buildBoutStructure(input.sequence);
    if (existing) {
      await updateCompetition(existing.id, {
        categoryId: input.categoryId,
        name: input.name,
        date: input.date,
        boutStructure,
        participantIds: input.participantIds,
        startNumbers: input.startNumbers,
      });
      navigate(`/competitions/${existing.id}`);
    } else {
      const created = await createCompetition({
        categoryId: input.categoryId,
        name: input.name,
        date: input.date,
        boutStructure,
        participantIds: input.participantIds,
        startNumbers: input.startNumbers,
      });
      navigate(`/competitions/${created.id}`);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <PageHeader
        title={isEdit ? 'Uredi tekmo' : 'Nova tekma'}
        showBack
        onBack={() => navigate(existing ? `/competitions/${existing.id}` : '/competitions')}
      />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <CompetitionForm
          categories={categories}
          initial={existing}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Shrani spremembe' : 'Ustvari tekmo'}
        />
      </div>
    </div>
  );
}
