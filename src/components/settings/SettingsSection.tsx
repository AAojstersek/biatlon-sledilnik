import type { ReactNode } from 'react';
import styles from './SettingsSection.module.css';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.title}>{title}</div>
      {children}
    </section>
  );
}
