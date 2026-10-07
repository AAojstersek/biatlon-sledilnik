import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft } from '../common/Icon';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, showBack = false, onBack, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`${styles.header} ${showBack ? '' : styles.large}`}>
      {showBack && (
        <button
          type="button"
          className={styles.back}
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="Nazaj"
        >
          <IconChevronLeft size={26} strokeWidth={2} />
        </button>
      )}
      <div className={styles.titles}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
