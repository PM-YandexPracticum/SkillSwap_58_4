# src/shared/lib/image

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Картинки: адрес для `<img src>` из значения в данных (`resolveImageUrl`: путь, data URL или заглушка) и превращение выбранного файла в data URL (`fileToDataUrl`).

## Что внутри

- `fileToDataUrl.ts` — Превращает выбранный файл картинки в data URL — так фото можно сохранить в «базе» (localStorage) без сервера. Перед вызовом файл проверяется `validateImageFile` (тип и размер до 1 МБ). При переходе на настоящую БД вместо этого файл отправляется на сервер, а в данные пишется ссылка
- `index.ts` — публичный API — импортировать снаружи только отсюда
- `resolveImageUrl.ts` — Что показать, если фото нет
