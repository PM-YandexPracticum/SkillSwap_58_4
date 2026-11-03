import { createMockCollection } from './createMockCollection'

/**
 * Проверяет общий сброс из `src/setupTests.ts`: изменения «базы» не переходят в следующий тест.
 * Своих beforeEach / afterEach здесь нет намеренно — тесты идут по порядку и зависят только от общего сброса.
 */
const items = () => createMockCollection('isolation', [{ id: 'a' }], { delayMs: 0 })

describe('изоляция тестов', () => {
  it('тест меняет «базу» и localStorage', async () => {
    await items().create({ id: 'b' })
    localStorage.setItem('skillswap_session', 'вошёл')

    expect(await items().getAll()).toHaveLength(2)
  })

  it('следующий тест снова видит только образцы и пустой localStorage', async () => {
    expect(await items().getAll()).toEqual([{ id: 'a' }])
    expect(localStorage.getItem('skillswap_session')).toBeNull()
  })
})
