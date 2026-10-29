# src/shared/lib/validation

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Общие правила валидации: готовые yup-поля (email, пароль, имя, дата рождения, текст, город) и проверка картинок. Правила — `docs/rules/validation.md`, лимиты — `shared/config/validation.ts`.

## Что внутри

- `fields.ts` — Готовые yup-поля для форм. Каждая форма собирает схему из них, а не пишет правила заново — так тексты ошибок и лимиты везде одинаковые. Лимиты — из `VALIDATION` (`@/shared/config`). Правила и тексты ошибок — `docs/rules/validation.md`
- `index.ts` — публичный API — импортировать снаружи только отсюда
- `validateImageFile.ts` — Проверяет картинку перед загрузкой: тип (jpg, png, webp) и размер (до 1 МБ) из `VALIDATION.IMAGE`
