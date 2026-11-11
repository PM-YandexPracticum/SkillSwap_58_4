import { Button } from '@/shared/ui/Button'

export interface ErrorActionsProps {
  /** Переход на главную страницу приложения. */
  onHome: () => void
}

/** Общие действия страниц 404 и 500. Кнопка сообщения остаётся заглушкой по ТЗ. */
export function ErrorActions({ onHome }: ErrorActionsProps) {
  return (
    <>
      <Button variant="secondary">Сообщить об ошибке</Button>
      <Button variant="primary" onClick={onHome}>
        На главную
      </Button>
    </>
  )
}
