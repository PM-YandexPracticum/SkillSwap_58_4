export interface StepSkillProps {
  /** «Продолжить» с валидной формой — открывается SkillPreviewModal */
  onNext: () => void
  onBack: () => void
  /** Выбранные фото навыка — хранятся вне Redux до завершения регистрации */
  onImageFiles: (files: File[]) => void
}

/**
 * Шаг 3 «Укажите, чем вы готовы поделиться». Слева SkillForm, справа иллюстрация и подпись
 * «Так другие люди смогут увидеть ваши предложения и предложить вам обмен!». «Может научить» — ровно один навык.
 * После «Продолжить» — SkillPreviewModal (1:1799): «Редактировать» возвращает к форме, «Готово» завершает регистрацию.
 * @see Figma: «Регистрация 3 шаг» (1:1761), окно — 1:1799
 */
export function StepSkill(_props: StepSkillProps) {
  // TODO: SkillForm + SkillPreviewModal
  return null
}
