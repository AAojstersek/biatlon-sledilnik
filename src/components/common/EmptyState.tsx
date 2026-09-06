import type { ReactNode } from 'react';
import { IconTarget } from './Icon';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.iconCircle}>{icon ?? <IconTarget size={30} />}</div>
      <div className={styles.title}>{title}</div>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}
