/**
 * Склоняет русское слово по числу.
 * @example pluralize(34, ['год', 'года', 'лет']) // 'года'
 * @param count число
 * @param forms формы для 1, 2–4 и 5+ (`['год', 'года', 'лет']`)
 */
export function pluralize(count: number, forms: readonly [string, string, string]): string {
  const [one, few, many] = forms
  const lastTwo = Math.abs(count) % 100
  const last = lastTwo % 10

  // 11–14 — всегда «лет»: «11 лет», «112 лет»
  if (lastTwo >= 11 && lastTwo <= 14) return many
  if (last === 1) return one
  if (last >= 2 && last <= 4) return few
  return many
}
