import sample from './sample.json'
import part1 from './part-1.json'
import part2 from './part-2.json'
import part3 from './part-3.json'

/**
 * Все пользователи — 45 человек: образцы `sample.json` (u01–u03) и части `part-1…3.json`, которые заполнила команда
 * в задачах P1-06…P1-08 (свой файл у каждой — чтобы работать одновременно без конфликтов).
 */
export const users: readonly unknown[] = [...sample, ...part1, ...part2, ...part3]
