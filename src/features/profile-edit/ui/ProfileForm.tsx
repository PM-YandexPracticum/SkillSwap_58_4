import { useState } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { selectCities } from '@/entities/city';
import { useAppSelector } from '@/shared/lib/store';
import styles from './ProfileForm.module.css';

export interface ProfileFormProps {
  className?: string;
}

/**
 * Форма редактирования личных данных.
 * @see Figma: 1:2370
 */
export function ProfileForm({ className }: ProfileFormProps) {
  // Локальные стейты для полей (пока без сохранения)
  const [email, setEmail] = useState('Maria@gmail.com');
  const [name, setName] = useState('Мария');
  const [birthDate, setBirthDate] = useState('1995-10-28');
  const [gender, setGender] = useState<string | null>('female');
  const [cityId, setCityId] = useState<string | null>('msk');
  const [about, setAbout] = useState(
    'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!'
  );

  // Получаем города из стора для селекта
  const cities = useAppSelector(selectCities);
  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }));

  // Опции для пола
  const genderOptions = [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
  ];

  return (
    <div className={[styles.form, className].filter(Boolean).join(' ')}>
      <div className={styles.fieldGroup}>
        <Input
          label="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
         rightIcon={
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
}
        />
        <button type="button" className={styles.changePassword}>
          Изменить пароль
        </button>
      </div>

      <Input
        label="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        rightIcon={
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
}
      />

      <div className={styles.row}>
        <Input
          label="Дата рождения"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <Select
          label="Пол"
          options={genderOptions}
          value={gender}
          onChange={setGender}
        />
      </div>

      <Select
        label="Город"
        options={cityOptions}
        value={cityId}
        onChange={setCityId}
        searchable
      />

      <Textarea
        label="О себе"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rightIcon={
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
}
        rows={5}
      />

      <Button variant="primary" type="submit" className={styles.submitButton}>
        Сохранить
      </Button>
    </div>
  );
}
