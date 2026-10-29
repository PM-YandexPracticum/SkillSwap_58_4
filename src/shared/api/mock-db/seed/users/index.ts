import sample from './sample.json'
import part1 from './part-1.json'
import part2 from './part-2.json'
import part3 from './part-3.json'

/**
 * Все пользователи-образцы. Сейчас — 3 примера (`sample.json`).
 * Команда добавляет остальных по образцу: каждая задача (P1-06…P1-08) заполняет свой файл `part-N.json`
 * (так несколько человек работают одновременно без конфликтов). Файлы и импорты уже подключены — этот файл не трогаем.
 */
export const users: readonly unknown[] = [...sample, ...part1, ...part2, ...part3]
