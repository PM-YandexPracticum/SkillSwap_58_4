import { expect, test } from '@playwright/test'

import { getSkillRoute, ROUTES } from '../src/shared/config'
import { author, expectCatalog, popularAuthor, popularSkill, seed, skill } from './helpers'

test('каталог показывает карточки, независимо раскрывает секции и открывает навык', async ({
  page,
}) => {
  await page.goto(ROUTES.HOME)
  await expectCatalog(page)
  const popular = page.getByRole('region', { name: 'Популярное', exact: true })
  const newest = page.getByRole('region', { name: 'Новое', exact: true })
  const popularCards = popular.getByRole('article').filter({ visible: true })
  const newestCards = newest.getByRole('article').filter({ visible: true })
  await expect(popularCards).toHaveCount(3)
  await popular.getByRole('button', { name: 'Смотреть все' }).click()
  await expect(popularCards).toHaveCount(9)
  await expect(newestCards).toHaveCount(3)
  const knownCard = popular.getByRole('article').filter({ hasText: popularAuthor.name })
  await expect(knownCard).toHaveCount(1)
  const knownLink = knownCard.getByRole('link', { name: 'Подробнее' })
  await expect(knownLink).toHaveAttribute('href', getSkillRoute(popularSkill.id))
  await knownLink.click()
  await expect(page).toHaveURL(getSkillRoute(popularSkill.id))
  await expect(page.getByRole('heading', { level: 1, name: popularSkill.title })).toBeVisible()
})

for (const submit of ['Enter', 'лупа'] as const) {
  test(`поиск применяется по ${submit}, очистка возвращает секции`, async ({ page }) => {
    await page.goto(ROUTES.HOME)
    await expectCatalog(page)
    const search = page.getByRole('textbox', { name: 'Искать навык' })
    await search.fill(`  ${skill.title.toUpperCase()}  `)
    await expect(page.getByRole('heading', { name: 'Популярное', exact: true })).toBeVisible()
    if (submit === 'Enter') await search.press('Enter')
    else await page.getByRole('button', { name: 'Искать', exact: true }).click()
    const results = page.getByRole('region', { name: 'Подходящие предложения: 1', exact: true })
    await expect(results.getByRole('article')).toHaveCount(1)
    await expect(results.getByRole('heading', { name: author.name, exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Очистить поиск' }).click()
    await expect(search).toHaveValue('')
    await expectCatalog(page)
  })
}

test('пустая выдача поиска восстанавливается после исправления запроса', async ({ page }) => {
  await page.goto(ROUTES.HOME)
  const search = page.getByRole('textbox', { name: 'Искать навык' })
  await search.fill('несуществующий-навык-e2e')
  await search.press('Enter')
  await expect(page.getByRole('status')).toContainText('Ничего не нашлось')
  await expect(page.getByRole('article')).toHaveCount(0)
  await search.fill(skill.title)
  await search.press('Enter')
  await expect(page.getByRole('region', { name: 'Подходящие предложения: 1' })).toBeVisible()
  await expect(page.getByRole('status')).toHaveCount(0)
})

test('лента догружает карточки без дублей и сбрасывает выдачу при новом поиске', async ({
  page,
}) => {
  await page.goto(ROUTES.HOME)
  await expectCatalog(page)
  const recommended = page.getByRole('region', { name: 'Рекомендуем', exact: true })
  const cards = recommended.getByRole('article')
  await expect(cards).toHaveCount(6)
  await page.keyboard.press('End')
  await expect(recommended.getByRole('status', { name: 'Загрузка' })).toBeVisible()
  await expect(cards).toHaveCount(12)
  const links = await cards
    .getByRole('link', { name: 'Подробнее' })
    .evaluateAll((items) => items.map((item) => item.getAttribute('href')))
  expect(links).toHaveLength(12)
  expect(links.every(Boolean)).toBe(true)
  expect(new Set(links).size).toBe(links.length)
  const search = page.getByRole('textbox', { name: 'Искать навык' })
  await search.fill(skill.title)
  await search.press('Enter')
  const results = page.getByRole('region', { name: 'Подходящие предложения: 1', exact: true })
  await expect(results.getByRole('article')).toHaveCount(1)
  await page.getByRole('button', { name: 'Очистить поиск' }).click()
  await expect(cards).toHaveCount(6)
})

test('город сочетается с поиском, удаление плашки сохраняет запрос', async ({ page }) => {
  await page.goto(ROUTES.HOME)
  await page.getByRole('checkbox', { name: 'Москва', exact: true }).check()
  const results = page.getByRole('region', { name: /^Подходящие предложения:/ })
  await expect(results.getByRole('article')).toHaveCount(3)
  for (const card of await results.getByRole('article').all()) {
    await expect(card).toContainText('Москва,')
  }
  const search = page.getByRole('textbox', { name: 'Искать навык' })
  await search.fill(skill.title)
  await search.press('Enter')
  await expect(page.getByRole('status')).toContainText('Ничего не нашлось')
  await page.getByRole('button', { name: 'Удалить Москва', exact: true }).click()
  await expect(search).toHaveValue(skill.title)
  await expect(page.getByRole('checkbox', { name: 'Москва', exact: true })).not.toBeChecked()
  await expect(results.getByRole('article')).toHaveCount(1)
  await expect(results.getByRole('heading', { name: author.name, exact: true })).toBeVisible()
})

test('сортировка меняет порядок результатов, сброс убирает фильтр', async ({ page }) => {
  await page.goto(ROUTES.HOME)
  await page.getByRole('checkbox', { name: 'Москва', exact: true }).check()
  const cards = page.getByRole('region', { name: /^Подходящие предложения:/ }).getByRole('article')
  const moscow = seed.users.filter((user) => user.cityId === 'msk')
  const sorted = [...moscow].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  await expect(cards.first().getByRole('heading', { level: 3 })).toHaveText(sorted.at(-1)!.name)
  await page.getByRole('button', { name: 'Сначала новые' }).click()
  await expect(cards.first().getByRole('heading', { level: 3 })).toHaveText(sorted[0].name)
  await page.getByRole('button', { name: 'Сбросить' }).click()
  await expect(page.getByRole('checkbox', { name: 'Москва', exact: true })).not.toBeChecked()
  await expect(page.getByRole('list', { name: 'Выбранные фильтры' })).toHaveCount(0)
  await expectCatalog(page)
})

// Ожидаемые авторы из действующих public/db: не вызываем и не копируем applyFilters.
for (const { mode, expectedNames, expectedSkillIds } of [
  { mode: 'Могу научить', expectedNames: ['Иван', 'Наталья'], expectedSkillIds: ['s01', 's09'] },
  {
    mode: 'Хочу научиться',
    expectedNames: ['Мария', 'Дмитрий', 'Максим'],
    expectedSkillIds: ['s03', 's06', 's12'],
  },
]) {
  test(`режим «${mode}» отбирает авторов по соответствующей стороне навыка`, async ({ page }) => {
    await page.goto(ROUTES.HOME)
    await page.getByRole('radio', { name: mode, exact: true }).check()
    await page
      .getByRole('button', { name: 'Развернуть категорию «Творчество и искусство»' })
      .click()
    await page.getByRole('checkbox', { name: 'Музыка и звук', exact: true }).check()
    const results = page.getByRole('region', {
      name: `Подходящие предложения: ${expectedNames.length}`,
      exact: true,
    })
    await expect(results.getByRole('article')).toHaveCount(expectedNames.length)
    const names = await results.getByRole('heading', { level: 3 }).allTextContents()
    expect(names.sort()).toEqual([...expectedNames].sort())
    const hrefs = await results
      .getByRole('link', { name: 'Подробнее' })
      .evaluateAll((items) => items.map((item) => item.getAttribute('href')))
    expect(hrefs.sort()).toEqual(expectedSkillIds.map(getSkillRoute).sort())
  })
}
