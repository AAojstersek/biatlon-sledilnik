import { useState } from 'react';
import type { Category } from '../../types/models';
import { useCompetitors } from '../../hooks/useCompetitors';
import {
  addCompetitor,
  renameCompetitor,
  setCompetitorArchived,
} from '../../db/repositories/competitors';
import { Button } from '../common/Button';
import styles from './RosterManager.module.css';

interface RosterManagerProps {
  categories: Category[];
}

export function RosterManager({ categories }: RosterManagerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const categoryId = categories.some((c) => c.id === selectedCategoryId)
    ? selectedCategoryId
    : (categories[0]?.id ?? '');
  const competitors = useCompetitors(categoryId, true);
  const [newName, setNewName] = useState('');

  async function handleAdd() {
    const name = newName.trim();
    if (!name || !categoryId) return;
    await addCompetitor(categoryId, name);
    setNewName('');
  }

  return (
    <>
      <div className={styles.segmented}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`${styles.segmentedOption} ${
              categoryId === category.id ? styles.segmentedActive : ''
            }`}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {competitors.map((competitor) => (
          <div key={competitor.id} className={styles.item}>
            <input
              className={`${styles.name} ${competitor.archived ? styles.archived : ''}`}
              defaultValue={competitor.name}
              onBlur={(e) => {
                const trimmed = e.target.value.trim();
                if (trimmed && trimmed !== competitor.name) renameCompetitor(competitor.id, trimmed);
              }}
            />
            {!competitor.isChild && (
              <button
                type="button"
                className={styles.iconBtn}
                title={competitor.archived ? 'Obnovi' : 'Arhiviraj'}
                onClick={() => setCompetitorArchived(competitor.id, !competitor.archived)}
              >
                {competitor.archived ? '↺' : '🗄'}
              </button>
            )}
          </div>
        ))}
        {competitors.length === 0 && <p>Ni tekmovalcev v tej kategoriji.</p>}
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
    </>
  );
}
