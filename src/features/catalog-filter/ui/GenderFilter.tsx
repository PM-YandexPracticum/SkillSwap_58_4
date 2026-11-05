import { useState } from 'react';
import { RadioGroup } from '@/shared/ui/RadioGroup';
import styles from './GenderFilter.module.css';

export interface GenderFilterProps {
  /** Дополнительный CSS-класс */
  className?: string;
}

/**
 * Радио «Не имеет значения / Мужской / Женский».
 */
export function GenderFilter({ className }: GenderFilterProps) {
  const [gender, setGender] = useState('any');

  const options = [
    { value: 'any', label: 'Не имеет значения' },
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
  ];

  return (
    <RadioGroup
      label="Пол автора"
      name="catalog-gender"
      options={options}
      value={gender}
      onChange={setGender}
      className={[styles.genderFilter, className].filter(Boolean).join(' ')}
    />
  );
}
