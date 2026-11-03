# src/shared/lib/image

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Картинки: адрес для `<img src>` из значения в данных (`resolveImageUrl`: путь, data URL или заглушка), превращение выбранного файла в data URL (`fileToDataUrl`) и расчёт размеров для уменьшения фото перед сохранением (`getScaledSize`).

## Что внутри

- `fileToDataUrl.ts` — Превращает выбранный файл картинки в data URL — так фото можно сохранить в «базе» (localStorage) без сервера. Перед вызовом файл проверяется `validateImageFile` (тип и размер до 1 МБ). До сохранения фото уменьшается до 800 px по длинной стороне и пересохраняется в JPEG (числа — `VALIDATION.IMAGE.MAX_SIDE_PX` и `JPEG_QUALITY` в `@/shared/config`); маленькие фото возвращаются как есть. При переходе на настоящую БД вместо этого файл отправляется на сервер, а в данные пишется ссылка
- `fileToDataUrl.test.ts` — Тесты `fileToDataUrl`
- `getScaledSize.ts` — Считает размеры, до которых надо уменьшить фото, чтобы длинная сторона не превышала 800 px. Пропорции сохраняются. Используется в `fileToDataUrl`, вынесен отдельно, чтобы тестировать расчёт без canvas
- `getScaledSize.test.ts` — Тесты `getScaledSize`
- `index.ts` — публичный API — импортировать снаружи только отсюда
- `resolveImageUrl.ts` — превращает путь из моков в адрес для `<img>`: без фото — заглушка из `IMAGE_PLACEHOLDERS`, к локальному пути добавляется `BASE_URL`. Все картинки проекта выводятся только через неё
- `resolveImageUrl.test.ts` — тесты: заглушка, `BASE_URL`, адреса `data:`, `blob:` и внешние
