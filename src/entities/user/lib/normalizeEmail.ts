/** Единое сравнение email при поиске пользователя и записи: без краевых пробелов и регистра. */
export const normalizeEmail = (email: string): string => email.trim().toLowerCase()
