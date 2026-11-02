import sample from './sample.json'
import part1 from './part-1.json'
import part2 from './part-2.json'
import part3 from './part-3.json'

/**
 * Все навыки — по одному на пользователя, 45 шт. Файлы те же, что у пользователей: `sample.json` и `part-1…3.json`.
 */
export const skills: readonly unknown[] = [...sample, ...part1, ...part2, ...part3]
