import type { LoginFormValues } from './schema'

/**
 * Вход только по пользователям, которые есть в «базе» (уже загружены в store):
 * найти пользователя по email (без учёта регистра), сравнить пароль с полем `password`,
 * создать сессию: `dispatch(startSession(user.id))` из `@/entities/session` — она же сохранит её в localStorage.
 * При неверной паре — одна общая ошибка «Email или пароль введён неверно» (фрейм Error_wrongLogPass):
 * не подсказываем, что именно неверно.
 * @returns id пользователя
 * @throws {Error} при неверной паре email/пароль
 */
export async function login(_values: LoginFormValues): Promise<string> {
  // TODO: selectUserByEmail → сравнение пароля → dispatch(startSession(user.id))
  throw new Error('Not implemented: login')
}
