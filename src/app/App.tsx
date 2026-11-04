import { StoreProvider } from './providers/StoreProvider'
import { ToastProvider } from './providers/ToastProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/global.css'

export function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
