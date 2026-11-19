import type { ReactNode } from 'react'

import styles from './StepSkill.module.css'

export interface StepSkillProps {
  /**
   * Форма навыка (`SkillForm` из features/skill-create). Слайсы features не импортируют друг друга,
   * поэтому форму подставляет страница, как `avatarUpload` в StepProfile.
   */
  skillForm: ReactNode
  /** Окна шага: превью «Ваше предложение» (`SkillPreviewModal`). Тоже собирает страница. */
  previewModal?: ReactNode
}

/**
 * Шаг 3 «Укажите, чем вы готовы поделиться»: колонка формы слева (иллюстрация и подпись «Так другие люди смогут
 * увидеть ваши предложения и предложить вам обмен!» — в RegisterLayout). «Может научить» — ровно один навык.
 * После «Продолжить» страница открывает превью (1:1799): «Редактировать» возвращает к форме, «Готово» завершает регистрацию.
 * Проверка формы и фото — P6-05, сохранение данных — P6-06.
 * @see Figma: «Регистрация 3 шаг» (1:1761), окно — 1:1799
 */
export function StepSkill({ skillForm, previewModal }: StepSkillProps) {
  return (
    <div className={styles.step}>
      {skillForm}
      {previewModal}
    </div>
  )
}
