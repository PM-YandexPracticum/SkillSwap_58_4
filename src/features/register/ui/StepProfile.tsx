export interface StepProfileProps {
  onNext: () => void
  onBack: () => void
  /** Выбранный файл аватара — хранится вне Redux до завершения регистрации */
  onAvatarFile: (file: File) => void
}

/**
 * Шаг 2 «Расскажите немного о себе»: аватар (кружок с «+»), Имя, Дата рождения (DatePicker) + Пол (Select:
 * Не указан / Мужской / Женский) в одну строку, Город (Select с поиском), «Категория навыка, которому хотите научиться»
 * и «Подкатегория…» — CategorySubcategorySelect в режиме `multiple` (списки с чекбоксами). «Назад» / «Продолжить».
 * «О себе» здесь нет — только в профиле.
 * @see Figma: «Регистрация 2 шаг» — 1:1497, 1:1541 (календарь), 1:1585 (пол), 1:1629 (город), 1:1673 (категории), 1:1717 (подкатегории)
 */
export function StepProfile(_props: StepProfileProps) {
  // TODO: react-hook-form + profileSchema; данные → draftUpdated
  return null
}
