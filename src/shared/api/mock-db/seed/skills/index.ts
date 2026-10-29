import sample from './sample.json'
import part1 from './part-1.json'
import part2 from './part-2.json'
import part3 from './part-3.json'

/**
 * Все навыки-образцы — по одному на пользователя. Сейчас — 3 примера (`sample.json`).
 * Добавляются вместе с пользователями: `part-N.json` с теми же номерами задач.
 */
export const skills: readonly unknown[] = [...sample, ...part1, ...part2, ...part3]
