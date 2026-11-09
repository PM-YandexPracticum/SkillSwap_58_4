import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ROUTES } from '@/shared/config'

import { NotFoundPage } from './NotFoundPage'

/**
 * Тексты страницы 404 — строго по макету «404» (Figma 1:2048).
 * Заданы здесь, а не импортированы из компонента: опечатка в компоненте должна ронять тест.
 */
const TITLE = 'Страница не найдена'

/** Описание под заголовком — тоже по макету. */
const DESCRIPTION =
  'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже'

/** Alt картинки: по нему картинку «видит» и незрячий пользователь, и тест. */
const IMAGE_ALT = 'Монитор с надписью 404 ERROR'

/** Неизвестные адреса для проверки: короткий, вложенный, с несуществующим id. */
const UNKNOWN_ROUTES = ['/nope', '/unknown/deep/path', '/skill/does-not-exist'] as const

/**
 * Тесты страницы «404»:
 * 1. контракт с макетом — заголовок, описание, картинка, две кнопки;
 * 2. неизвестный адрес → открывается 404 (`it.each`);
 * 3. «На главную» → пользователь на ROUTES.HOME;
 * 4. «Сообщить об ошибке» — заглушка по ТЗ п. 15.
 */
describe('NotFoundPage', () => {
  /** Контракт с макетом: заголовок, описание и картинка на месте. */
  it('показывает заголовок, описание и картинку по макету', () => {
    renderWithProviders(<NotFoundPage />)

    expect(screen.getByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument()
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: IMAGE_ALT })).toBeInTheDocument()
  })

  /** Контракт с макетом: у пользователя ровно два действия. */
  it('показывает ровно две кнопки', () => {
    renderWithProviders(<NotFoundPage />)

    expect(screen.getAllByRole('button')).toHaveLength(2) // две кнопки по макету
  })

  /**
   * неизвестный адрес → открывается 404.
   * `it.each` — повторяющиеся случаи таблицей (testing.md).
   * `<Route path="*">` имитирует AppRouter; `{ route }` — адрес, на который пришёл пользователь.
   */
  it.each(UNKNOWN_ROUTES)('по неизвестному адресу %s открывается страница 404', (route) => {
    renderWithProviders(
      <Routes>
        <Route path="*" element={<NotFoundPage />} /> {/* ловит все неизвестные адреса */}
      </Routes>,
      { route },
    )

    expect(screen.getByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument()
  })

  /**
   * Клик «На главную» → пользователь на главной.
   *
   * На месте главной — заглушка, а не настоящий CatalogPage: тест страницы 404
   * не должен зависеть от Redux-слайсов, виджетов и данных каталога, иначе
   * поломка каталога будет ронять тест 404. Проверяем результат (попал на маршрут
   * ROUTES.HOME), а не вызов `navigate`: неверный адрес в компоненте сломает тест.
   * Связка «404 → настоящий каталог» проверяется в AppRouter.test.tsx.
   */
  it('по клику «На главную» переходит на ROUTES.HOME', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path={ROUTES.HOME} element={<div>Главная страница</div>} />
      </Routes>,
      { route: '/nope' },
    )

    await user.click(screen.getByRole('button', { name: 'На главную' }))

    expect(screen.getByText('Главная страница')).toBeInTheDocument()
  })

  /**
   * Клик «Сообщить об ошибке» — заглушка.
   * Кнопка активна, но действие не реализовано: после клика остаёмся на 404.
   */
  it('«Сообщить об ошибке» — заглушка: кнопка активна, но ничего не происходит', async () => {
    const { user } = renderWithProviders(<NotFoundPage />)
    const button = screen.getByRole('button', { name: 'Сообщить об ошибке' })

    expect(button).toBeEnabled() // кликается, а не disabled

    await user.click(button)

    expect(screen.getByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument() // остались на 404
  })
})
