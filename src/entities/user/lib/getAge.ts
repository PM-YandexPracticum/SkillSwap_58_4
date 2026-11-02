/**
 * Считает полный возраст по дате рождения («Санкт-Петербург, 34 года»).
 * Сравнивает календарные даты в часовом поясе пользователя: день рождения наступает в его полночь.
 * @param birthDate ISO-дата рождения
 * @param now текущая дата (параметр нужен для тестов)
 * @returns полных лет; 0, если дата рождения в будущем
 * @throws {RangeError} если `birthDate` — не дата
 */
export function getAge(birthDate: string, now: Date = new Date()): number {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) {
    throw new RangeError(`getAge: некорректная дата рождения «${birthDate}»`)
  }

  const age = now.getFullYear() - birth.getFullYear()
  const hadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())

  return Math.max(0, hadBirthdayThisYear ? age : age - 1)
}
