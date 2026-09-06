import { useState } from 'react';
import type { BoutType } from '../../types/models';
import { usePresets } from '../../hooks/usePresets';
import { addPreset, deletePreset } from '../../db/repositories/presets';
import { buildBoutStructure } from '../../utils/boutStructure';
import { boutLabel } from '../../types/models';
import { BoutStructureBuilder } from '../competition/BoutStructureBuilder';
import { Button } from '../common/Button';
import { IconTrash } from '../common/Icon';
import styles from './PresetManager.module.css';

export function PresetManager() {
  const presets = usePresets();
  const [name, setName] = useState('');
  const [sequence, setSequence] = useState<BoutType[]>([]);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed || sequence.length === 0) return;
    await addPreset(trimmed, buildBoutStructure(sequence));
    setName('');
    setSequence([]);
  }

  return (
    <>
      <div className={styles.list}>
        {presets.map((preset) => (
          <div key={preset.id} className={styles.item}>
            <div>
              <div className={styles.name}>{preset.name}</div>
              <div className={styles.sequence}>
                {preset.boutStructure.map((b) => boutLabel(b)).join(' · ')}
              </div>
            </div>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => deletePreset(preset.id)}
              aria-label="Izbriši predlogo"
            >
              <IconTrash size={17} />
            </button>
          </div>
        ))}
        {presets.length === 0 && <p className={styles.empty}>Ni shranjenih predlog.</p>}
      </div>

      <div className={styles.addForm}>
        <input
          className={styles.nameInput}
          placeholder="Ime predloge (npr. Šprint)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BoutStructureBuilder sequence={sequence} onChange={setSequence} presets={[]} />
        <Button type="button" variant="secondary" onClick={handleAdd}>
          Shrani predlogo
        </Button>
      </div>
    </>
  );
}
