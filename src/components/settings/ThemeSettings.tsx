import { useState } from 'react';
import { SegmentedControl } from '../common/SegmentedControl';
import { getThemeChoice, setThemeChoice, type ThemeChoice } from '../../utils/theme';

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: 'auto', label: 'Samodejno' },
  { value: 'light', label: 'Svetla' },
  { value: 'dark', label: 'Temna' },
];

export function ThemeSettings() {
  const [choice, setChoice] = useState<ThemeChoice>(getThemeChoice);

  return (
    <SegmentedControl
      options={OPTIONS}
      value={choice}
      onChange={(value) => {
        setChoice(value as ThemeChoice);
        setThemeChoice(value as ThemeChoice);
      }}
    />
  );
}
