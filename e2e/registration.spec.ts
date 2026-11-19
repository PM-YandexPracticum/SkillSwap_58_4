import { expect, test, type Page } from '@playwright/test'

import { getSkillRoute, MOCK_DB, ROUTES, STORAGE_KEYS } from '../src/shared/config'
import { expectCatalog, failNextStorageWrite } from './helpers'

const account = {
  email: 'registration-e2e@example.com',
  password: 'Registration123',
  name: 'Тестовый участник',
  skillTitle: 'Маркетинг для начинающих E2E',
  description: 'Научу планировать рекламную кампанию и оценивать её результаты.',
}

/** Все три шага проходим через форму; одноцветное PNG заменяет внешний файл фотографии. */
async function openRegistrationPreview(page: Page) {
  await page.goto(ROUTES.REGISTER_STEP_1)
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(account.email)
  await page.getByLabel('Пароль', { exact: true }).fill(account.password)
  await page.getByLabel('Пароль', { exact: true }).press('Tab')
  await page.getByRole('button', { name: 'Далее', exact: true }).click()
  await expect(page).toHaveURL(ROUTES.REGISTER_STEP_2)

  await page.getByRole('textbox', { name: 'Имя', exact: true }).fill(account.name)
  await page.getByRole('textbox', { name: 'Дата рождения', exact: true }).fill('01.01.1990')
  await page.getByRole('combobox', { name: 'Город', exact: true }).click()
  await page.getByRole('option', { name: 'Москва', exact: true }).click()
  await page.getByRole('button', { name: /^Категория навыка, которому хотите научиться/ }).click()
  await page.getByRole('checkbox', { name: 'Бизнес и карьера', exact: true }).check()
  await page.getByRole('button', { name: /^Категория навыка, которому хотите научиться/ }).click()
  await page
    .getByRole('button', { name: /^Подкатегория навыка, которому хотите научиться/ })
    .click()
  await page.getByRole('checkbox', { name: 'Маркетинг и реклама', exact: true }).check()
  await page
    .getByRole('button', { name: /^Подкатегория навыка, которому хотите научиться/ })
    .click()
  await page.getByRole('button', { name: 'Продолжить', exact: true }).click()
  await expect(page).toHaveURL(ROUTES.REGISTER_STEP_3)

  await page.getByRole('textbox', { name: 'Название навыка', exact: true }).fill(account.skillTitle)
  await page.getByRole('combobox', { name: 'Категория навыка', exact: true }).click()
  await page.getByRole('option', { name: 'Бизнес и карьера', exact: true }).click()
  await page.getByRole('combobox', { name: 'Подкатегория навыка', exact: true }).click()
  await page.getByRole('option', { name: 'Маркетинг и реклама', exact: true }).click()
  await page.getByRole('textbox', { name: 'Описание', exact: true }).fill(account.description)
  const chooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Выбрать изображения', exact: true }).click()
  await (
    await chooser
  ).setFiles({
    name: 'skill.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGNwaJgARwzEcQAdUhUBdh+h1gAAAABJRU5ErkJggg==',
      'base64',
    ),
  })
  const photo = page.getByRole('img', { name: 'Фото 1', exact: true })
  await expect(photo).toBeVisible()
  await expect(photo).toHaveJSProperty('naturalWidth', 4)
  await page.getByRole('button', { name: 'Продолжить', exact: true }).click()
  const preview = page.getByRole('dialog', { name: 'Ваше предложение', exact: true })
  await expect(preview).toBeVisible()
  await expect(preview).toContainText(account.skillTitle)
  await expect(preview).toContainText(account.description)
  return preview
}

/** Контракт localStorage проверяет согласованность пары после действий пользователя. */
async function readRegistration(page: Page) {
  return page.evaluate(
    ({ email, title, prefix, sessionKey }) => {
      const users: { id: string; email: string; teachSkillId: string }[] = JSON.parse(
        localStorage.getItem(`${prefix}users`) ?? '[]',
      )
      const skills: { id: string; title: string; authorId: string; images: string[] }[] =
        JSON.parse(localStorage.getItem(`${prefix}skills`) ?? '[]')
      return {
        users: users.filter((user) => user.email === email),
        skills: skills.filter((skill) => skill.title === title),
        session: JSON.parse(localStorage.getItem(sessionKey) ?? 'null') as {
          userId: string
        } | null,
      }
    },
    {
      email: account.email,
      title: account.skillTitle,
      prefix: MOCK_DB.STORAGE_PREFIX,
      sessionKey: STORAGE_KEYS.SESSION,
    },
  )
}

async function expectSavedRegistration(page: Page) {
  const saved = await readRegistration(page)
  expect(saved.users).toHaveLength(1)
  expect(saved.skills).toHaveLength(1)
  expect(saved.users[0].teachSkillId).toBe(saved.skills[0].id)
  expect(saved.skills[0].authorId).toBe(saved.users[0].id)
  expect(saved.skills[0].images).toHaveLength(1)
  expect(saved.skills[0].images[0]).toMatch(/^data:image\//)
  expect(saved.session?.userId).toBe(saved.users[0].id)
  return saved
}

test('регистрация в три шага создаёт предложение и сессию, перезагрузка сохраняет результат', async ({
  page,
}) => {
  const preview = await openRegistrationPreview(page)
  // Сам просмотр не создаёт пользователя, навык или сессию.
  const before = await readRegistration(page)
  expect(before.users).toHaveLength(0)
  expect(before.skills).toHaveLength(0)
  expect(before.session).toBeNull()
  await preview.getByRole('button', { name: 'Редактировать', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'Название навыка', exact: true })).toHaveValue(
    account.skillTitle,
  )
  await page.getByRole('button', { name: 'Продолжить', exact: true }).click()
  await preview.getByRole('button', { name: 'Готово', exact: true }).click()
  const success = page.getByRole('dialog', { name: 'Ваше предложение создано', exact: true })
  await expect(success).toBeVisible()
  const saved = await expectSavedRegistration(page)
  await success.getByRole('button', { name: 'Готово', exact: true }).click()
  await expectCatalog(page)
  await expect(page.getByRole('button', { name: account.name, exact: true })).toBeVisible()
  const search = page.getByRole('textbox', { name: 'Искать навык', exact: true })
  await search.fill(account.skillTitle)
  await search.press('Enter')
  await expect(page.getByRole('article').filter({ hasText: account.name })).toContainText(
    account.skillTitle,
  )
  await page.reload()
  await expect(page.getByRole('button', { name: account.name, exact: true })).toBeVisible()
  await expect(success).toHaveCount(0)
  await expectSavedRegistration(page)
  await page.goto(getSkillRoute(saved.skills[0].id))
  await expect(page.getByRole('heading', { level: 1, name: account.skillTitle })).toBeVisible()
  await expect(page.getByText(account.description, { exact: true })).toBeVisible()
})

test('сбой после сохранения навыка не создаёт сессию, повтор завершает ту же пару без дублей', async ({
  page,
}) => {
  const preview = await openRegistrationPreview(page)
  await failNextStorageWrite(page, `${MOCK_DB.STORAGE_PREFIX}users`)
  await preview.getByRole('button', { name: 'Готово', exact: true }).click()
  await expect(preview.getByRole('alert')).toContainText('Не хватает места в браузере')
  await expect(page).toHaveURL(ROUTES.REGISTER_STEP_3)
  await expect(page.getByRole('dialog', { name: 'Ваше предложение создано' })).toHaveCount(0)
  const partial = await readRegistration(page)
  expect(partial.skills).toHaveLength(1)
  expect(partial.users).toHaveLength(0)
  expect(partial.session).toBeNull()

  await preview.getByRole('button', { name: 'Готово', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Ваше предложение создано' })).toBeVisible()
  const saved = await expectSavedRegistration(page)
  expect(saved.skills[0].id).toBe(partial.skills[0].id)
  await page.reload()
  await expect(page.getByRole('button', { name: account.name, exact: true })).toBeVisible()
  await expectSavedRegistration(page)
})
