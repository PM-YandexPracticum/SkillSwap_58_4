import type { ReactNode } from 'react';
import styles from './StepSkill.module.css';

export interface StepSkillProps {
  /** Готовая форма навыка */
  skillForm: ReactNode;
  /** Готовое окно превью (если есть) */
  previewModal?: ReactNode;
}

/**
 * Шаг 3 «Укажите, чем вы готовы поделиться».
 * Компонент-контейнер: рендерит переданную форму и окно превью.
 * @see Figma: «Регистрация 3 шаг» (1:1761), окно — 1:1799
 */
export function StepSkill({ skillForm, previewModal }: StepSkillProps) {
  return (
    <div className={styles.step}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Укажите, чем вы готовы поделиться</h2>
        <p className={styles.subtitle}>
          Так другие люди смогут увидеть ваши предложения и предложить вам обмен!
        </p>
        {skillForm}
      </div>
      {previewModal}
    </div>
  );
}
