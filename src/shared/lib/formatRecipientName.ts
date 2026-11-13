const NAME_EXCEPTIONS: Record<string, string> = {
  Павел: 'Павлу',
  Лев: 'Льву',
  Пётр: 'Петру',
  Петр: 'Петру',
  Любовь: 'Любови',
  Нинель: 'Нинели',
  Ия: 'Ии',
  Игорь: 'Игорю',
}

/**
 * Основные формы одиночных русских имён и исключения из текущей базы.
 * Латиницу, составные и неоднозначные окончания не угадывает; для мягкого знака учитывает пол.
 * Поддерживает основные окончания, а не произвольные имена и фамилии.
 */
export function formatRecipientName(name: string, gender?: 'male' | 'female' | null): string {
  const value = name.trim()
  if (!/^[А-ЯЁ][а-яё]+$/.test(value)) return value
  if (NAME_EXCEPTIONS[value]) return NAME_EXCEPTIONS[value]
  if (/ия$/.test(value)) return value.replace(/ия$/, 'ии')
  if (/[ая]$/.test(value)) return value.replace(/[ая]$/, 'е')
  if (gender === 'female') return value
  if (/ь$/.test(value)) return gender === 'male' ? value.replace(/ь$/, 'ю') : value
  if (/й$/.test(value)) return value.replace(/й$/, 'ю')
  if (/[бвгджзклмнпрстфхцчшщ]$/.test(value)) return `${value}у`
  return value
}
