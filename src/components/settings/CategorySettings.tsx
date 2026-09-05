import { useState } from 'react';
import type { Category } from '../../types/models';
import { renameCategory } from '../../db/repositories/categories';
import styles from './CategorySettings.module.css';

interface CategorySettingsProps {
  categories: Category[];
}

export function CategorySettings({ categories }: CategorySettingsProps) {
  return (
    <>
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [label, setLabel] = useState(category.label);

  return (
    <div className={styles.row}>
      <span className={styles.label}>{category.kind === 'son' ? 'Sin' : 'Hči'}</span>
      <input
        className={styles.input}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => {
          const trimmed = label.trim();
          if (trimmed && trimmed !== category.label) renameCategory(category.id, trimmed);
          else setLabel(category.label);
        }}
      />
    </div>
  );
}
