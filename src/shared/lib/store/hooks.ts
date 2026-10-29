import { useDispatch, useSelector } from 'react-redux'

/**
 * Типизированные хуки Redux. Всегда используй их вместо useDispatch/useSelector.
 *
 * Типы `RootState` и `AppDispatch` объявлены глобально в `app/store/index.ts`,
 * поэтому shared не импортирует ничего из app (правило FSD: импорт только «вниз»).
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
