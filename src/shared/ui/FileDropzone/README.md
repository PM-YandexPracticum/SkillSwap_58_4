# src/shared/ui/FileDropzone

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **FileDropzone**. Зона загрузки файлов: пунктирная рамка, перетаскивание (drag & drop) или выбор через скрытый `<input type="file">`. Во время перетаскивания рамка подсвечивается. Доступна с клавиатуры: Enter / Space открывают выбор файла.

## Что внутри

- `FileDropzone.stories.tsx` — Stories компонента FileDropzone — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof FileDropzone>` и `export const Default: StoryObj<typeof meta>`
- `FileDropzone.tsx` — Зона загрузки файлов: пунктирная рамка, перетаскивание (drag & drop) или выбор через скрытый `<input type="file">`. Во время перетаскивания рамка подсвечивается. Доступна с клавиатуры: Enter / Space открывают выбор файла
- `index.ts` — публичный API — импортировать снаружи только отсюда
