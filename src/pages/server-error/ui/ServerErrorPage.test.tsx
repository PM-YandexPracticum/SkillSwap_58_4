import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { ROUTES } from '@/shared/config'

import { ServerErrorPage } from './ServerErrorPage'

/**
 * Тексты страницы 500 — строго по макету «500» (Figma 1:2077).
 * Заданы здесь, а не импортированы из компонента: опечатка в компоненте должна ронять тест.
 */
const TITLE = 'На сервере произошла ошибка'

/** Описание под заголовком — тоже по макету; одна строка. */
const DESCRIPTION = 'Попробуйте позже или вернитесь на главную страницу'

/** Alt картинки: по нему картинку «видит» и незрячий пользователь, и тест. */
const IMAGE_ALT = 'Монитор с надписью 500 SERVER ERROR'

/** Заголовок 404 — чтобы проверить, что 500 не показывает чужой текст. */
const NOT_FOUND_TITLE = 'Страница не найдена'

/**
 * Тесты страницы «500».
 * Маршрут /500 открывается при ошибке загрузки DataProvider. Корневой ErrorBoundary
 * использует тот же ServerErrorView без роутера; его сценарии проверяются отдельно
 * в app/providers/ErrorBoundary.test.tsx и app/App.test.tsx.
 *
 * 1. контракт с макетом — заголовок, описание, картинка;
 * 2. ровно две кнопки;
 * 3. 500 не показывает текст 404 (защита от копипаста);
 * 4. «На главную» → пользователь на ROUTES.HOME;
 * 5. «Сообщить об ошибке» — заглушка по ТЗ п. 15.
 */
describe('ServerErrorPage', () => {
  /** Контракт с макетом: заголовок, описание и картинка на месте. */
  it('показывает заголовок, описание и картинку по макету', () => {
    renderWithProviders(<ServerErrorPage />)

    expect(screen.getByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument()
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: IMAGE_ALT })).toBeInTheDocument()
  })

  /** Контракт с макетом: у пользователя ровно два действия. */
  it('показывает ровно две кнопки', () => {
    renderWithProviders(<ServerErrorPage />)

    expect(screen.getAllByRole('button')).toHaveLength(2) // две кнопки по макету
  })

  /**
   * 500 не показывает заголовок 404.
   * Страховка от копипаста: если тексты перепутают местами, тест упадёт.
   * `queryBy*` вместо `getBy*` — потому что элемента быть НЕ должно.
   */
  it('не показывает заголовок страницы 404', () => {
    renderWithProviders(<ServerErrorPage />)

    expect(screen.queryByText(NOT_FOUND_TITLE)).not.toBeInTheDocument()
  })

  /**
   * Клик «На главную» → пользователь на главной.
   * На месте главной — заглушка: тест 500 не зависит от Redux-слайсов каталога.
   * Проверяем результат (попал на ROUTES.HOME), а не вызов `navigate`.
   */
  it('по клику «На главную» переходит на ROUTES.HOME', async () => {
    const { user } = renderWithProviders(
      <Routes>
        {/* Отдельный маршрут проверяет переход без загрузки всего приложения. */}
        <Route path="/test" element={<ServerErrorPage />} />
        <Route path={ROUTES.HOME} element={<div>Главная страница</div>} />
      </Routes>,
      { route: '/test' },
    )

    await user.click(screen.getByRole('button', { name: 'На главную' }))

    expect(screen.getByText('Главная страница')).toBeInTheDocument()
  })

  /**
   * Клик «Сообщить об ошибке» — заглушка.
   * Кнопка активна, но действие не реализовано: после клика остаёмся на 500.
   */
  it('«Сообщить об ошибке» — заглушка: кнопка активна, но ничего не происходит', async () => {
    const { user } = renderWithProviders(<ServerErrorPage />)
    const button = screen.getByRole('button', { name: 'Сообщить об ошибке' })

    expect(button).toBeEnabled() // кликается, а не disabled

    await user.click(button)

    expect(screen.getByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument() // остались на 500
  })
})
