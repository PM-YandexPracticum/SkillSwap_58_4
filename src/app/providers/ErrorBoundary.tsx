import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ServerErrorView } from '@/pages/server-error'

export interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Перехватывает ошибки рендера и жизненного цикла во всём дереве приложения.
 * Экран 500 не зависит от провайдеров, которые могли упасть.
 * Ошибки обработчиков событий и асинхронных операций обрабатываются в самих сценариях.
 * @see Figma: «500» (1:2077)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Ошибка приложения:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Полная загрузка восстанавливает упавшие провайдеры и повторяет загрузку lazy-модулей.
      // BASE_URL сохраняет путь приложения при публикации в подпапке.
      return <ServerErrorView onHome={() => window.location.assign(import.meta.env.BASE_URL)} />
    }
    return this.props.children
  }
}
