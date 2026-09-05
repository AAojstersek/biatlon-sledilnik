import { useRef, useState } from 'react';
import { exportData, importData } from '../../db/exportImport';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function DataBackup() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = '';
  }

  async function confirmImport() {
    if (!pendingFile) return;
    try {
      await importData(pendingFile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uvoz ni uspel.');
    } finally {
      setPendingFile(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Button type="button" variant="secondary" onClick={() => exportData()}>
        Izvozi podatke (varnostna kopija)
      </Button>
      <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
        Uvozi podatke
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleFileChosen}
      />
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      {pendingFile && (
        <ConfirmDialog
          title="Uvozi podatke?"
          message="Podatki iz datoteke bodo dodani/prepisani preko obstoječih. To dejanje ne moreš razveljaviti."
          confirmLabel="Uvozi"
          danger
          onConfirm={confirmImport}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </div>
  );
}
