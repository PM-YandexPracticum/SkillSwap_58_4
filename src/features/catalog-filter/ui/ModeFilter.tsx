import { useState } from 'react';
import { RadioGroup } from '@/shared/ui/RadioGroup';

export interface ModeFilterProps {
  /** Дополнительный CSS-класс */
  className?: string;
}

export function ModeFilter({ className }: ModeFilterProps) {
  // Локальный стейт для визуализации. По умолчанию выбрано "Всё", как в макете.
  const [mode, setMode] = useState('all');

  // Опции по макету
  const options = [
    { value: 'all', label: 'Всё' },
    { value: 'learn', label: 'Хочу научиться' },
    { value: 'teach', label: 'Могу научить' },
  ];

  return (
    <RadioGroup
      name="catalog-mode"
      options={options}
      value={mode}
      onChange={setMode}
      className={className}
    />
  );
}
