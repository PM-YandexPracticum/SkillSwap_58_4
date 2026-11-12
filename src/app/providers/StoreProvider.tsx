import { Provider } from 'react-redux'
import type { ReactNode } from 'react'
import { store } from '@/app/store'

interface StoreProviderProps {
  children: ReactNode
}

/** Предоставляет общий Redux store дочерним компонентам приложения. */
export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
