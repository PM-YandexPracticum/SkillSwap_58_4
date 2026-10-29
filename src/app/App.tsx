import { StoreProvider } from './providers/StoreProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/global.css'

export function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </StoreProvider>
  )
}
