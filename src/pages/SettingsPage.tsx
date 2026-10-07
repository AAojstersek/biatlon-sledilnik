import { PageHeader } from '../components/layout/PageHeader';
import { SettingsSection } from '../components/settings/SettingsSection';
import { CategorySettings } from '../components/settings/CategorySettings';
import { RosterManager } from '../components/settings/RosterManager';
import { PresetManager } from '../components/settings/PresetManager';
import { PointsTableEditor } from '../components/settings/PointsTableEditor';
import { DataBackup } from '../components/settings/DataBackup';
import { useCategories } from '../hooks/useCategories';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const categories = useCategories();

  return (
    <div className={styles.page}>
      <PageHeader title="Nastavitve" />
      <div className={styles.content}>
        <SettingsSection title="Kategoriji">
          <CategorySettings categories={categories} />
        </SettingsSection>

        <SettingsSection title="Tekmovalci">
          <RosterManager categories={categories} />
        </SettingsSection>

        <SettingsSection title="Predloge struktur strelanj">
          <PresetManager />
        </SettingsSection>

        <SettingsSection title="Točke po mestih">
          <PointsTableEditor categories={categories} />
        </SettingsSection>

        <SettingsSection title="Podatki">
          <DataBackup />
        </SettingsSection>
      </div>
    </div>
  );
}
