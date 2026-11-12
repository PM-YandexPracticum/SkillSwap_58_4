import { StoreProvider } from './providers/StoreProvider'
import { ToastProvider } from './providers/ToastProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRouter } from './providers/RouterProvider'
import { ErrorBoundary } from './providers/ErrorBoundary' // <--- Импортируем
import './styles/global.css'

export function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
