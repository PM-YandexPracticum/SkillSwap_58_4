import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import { ServerErrorView } from './ServerErrorView'

/**
 * Маршрут /500: готовый экран ошибки с возвратом на главную внутри приложения.
 * DataProvider открывает его при ошибке загрузки; корневой ErrorBoundary использует ServerErrorView.
 * @see Figma: «500» (1:2077)
 */
export function ServerErrorPage() {
  const navigate = useNavigate()
  return <ServerErrorView onHome={() => navigate(ROUTES.HOME)} />
}
