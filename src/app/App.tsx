import { StoreProvider } from './providers/StoreProvider'
import { ToastProvider } from './providers/ToastProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRouter } from './providers/RouterProvider'
import { ErrorBoundary } from './providers/ErrorBoundary'
import './styles/global.css'

/** Корень приложения: защита от сбоев, Redux, тема, уведомления и маршруты. */
export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}
