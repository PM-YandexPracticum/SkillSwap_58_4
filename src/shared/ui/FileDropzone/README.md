# src/shared/ui/FileDropzone

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **FileDropzone**. Зона загрузки файлов: пунктирная рамка, перетаскивание (drag & drop)
или выбор через скрытый `<input type="file">`. Во время перетаскивания рамка подсвечивается.
У зоны нет `tabIndex` — с клавиатуры работает кнопка «Выбрать изображения»:
Tab → Enter / Space открывают диалог.

Проверка файлов (тип, размер) — у родителя через `validateImageFile`:
компонент передаёт `File[]` в `onFiles`, а текст ошибки принимает пропом `error`.

## Что внутри

- `FileDropzone.tsx` — сам компонент + типы пропсов
- `FileDropzone.module.css` — стили: пунктирная рамка, состояния hover / drag / disabled
- `FileDropzone.stories.tsx` — Stories: `Default`, `Hover`, `Focus`, `Dragging`,
  `WithPreview`, `WithMultiplePreviews`, `WithError`, `Disabled`, `SingleFile`
- `FileDropzone.test.tsx` — unit-тесты (9 сценариев)
- `index.ts` — публичный API, импорт снаружи только отсюда

## Props

| Prop | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `hint` | `string` | — | Подпись внутри зоны |
| `buttonLabel` | `string` | — | Текст кнопки-ссылки |
| `accept` | `readonly string[]` | `VALIDATION.IMAGE.TYPES` | MIME-типы для `<input accept>` |
| `multiple` | `boolean` | `undefined` | Разрешить выбор нескольких файлов |
| `onFiles` | `(files: File[]) => void` | — | Отдаёт выбранные / перетащенные файлы |
| `previews` | `{ url, onRemove }[]` | `undefined` | Превью уже выбранных файлов |
| `error` | `string` | `undefined` | Текст ошибки под зоной |
| `disabled` | `boolean` | `undefined` | Блокирует выбор и drop |

## UX-детали

- клик по всей зоне открывает диалог выбора файла;
- кнопка дублирует клик и доступна с клавиатуры;
- `onClick` на `<input>` гасит всплытие — иначе диалог открывался бы дважды;
- `input.value` сбрасывается после выбора, чтобы повторный выбор того же файла срабатывал;
- drag & drop: `dragenter`/`dragleave` считаются через `useRef`, `drop` сбрасывает счётчик;
- крестик удаления — обычная `<button>` с собственными стилями, не `IconButton`
  (у `IconButton` нет `className` — нельзя задать размер и позицию поверх фото);
- у каждой кнопки удаления уникальная подпись «Удалить фото N» — скринридер
  понимает, какое именно фото удалит пользователь;

## Figma

Фрейм 1:1761 «Регистрация 3 шаг» — блок под «Описание».
Состояния hover и focus в макете не нарисованы — креативные значения.
