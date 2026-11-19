import { formatRecipientName } from './formatRecipientName'

describe('formatRecipientName', () => {
  it.each([
    ['Иван', 'Ивану'],
    ['Анна', 'Анне'],
    ['Мария', 'Марии'],
    ['Андрей', 'Андрею'],
    ['Игорь', 'Игорю'],
    ['Павел', 'Павлу'],
    ['Лев', 'Льву'],
    ['Пётр', 'Петру'],
    ['Любовь', 'Любови'],
    ['Alex', 'Alex'],
    ['Нино', 'Нино'],
    ['Иван Петров', 'Иван Петров'],
  ])('приводит имя %s к форме %s', (name, expected) => {
    expect(formatRecipientName(name)).toBe(expected)
  })

  it('не добавляет окончание к пустому имени', () => {
    expect(formatRecipientName('  ')).toBe('')
  })
})

describe('formatRecipientName: неоднозначные имена', () => {
  it('учитывает женский род для мягкого знака', () => {
    expect(formatRecipientName('Нинель', 'female')).toBe('Нинели')
  })
  it('сохраняет несклоняемое женское имя на согласную', () => {
    expect(formatRecipientName('Николь', 'female')).toBe('Николь')
    expect(formatRecipientName('Ким', 'female')).toBe('Ким')
  })
  it('не угадывает мягкий знак без информации о роде', () => {
    expect(formatRecipientName('Эмиль')).toBe('Эмиль')
    expect(formatRecipientName('Эмиль', 'male')).toBe('Эмилю')
  })
})
