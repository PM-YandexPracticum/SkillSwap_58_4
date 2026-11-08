# src/shared/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-кит: базовые компоненты из макета без бизнес-логики. Импорт по компоненту: `@/shared/ui/Button` (общего index.ts нет намеренно).

## Что внутри

- [`Avatar/`](Avatar/README.md) — компонент `Avatar`
- [`Button/`](Button/README.md) — компонент `Button`
- [`Carousel/`](Carousel/README.md) — компонент `Carousel`
- [`Checkbox/`](Checkbox/README.md) — компонент `Checkbox`
- [`DatePicker/`](DatePicker/README.md) — компонент `DatePicker`
- [`Dropdown/`](Dropdown/README.md) — компонент `Dropdown`
- [`FileDropzone/`](FileDropzone/README.md) — компонент `FileDropzone`
- [`IconButton/`](IconButton/README.md) — компонент `IconButton`
- [`IllustrationCard/`](IllustrationCard/README.md) — карточка с иллюстрацией, заголовком и текстом (правая половина входа и регистрации)
- [`Input/`](Input/README.md) — компонент `Input`
- [`Loader/`](Loader/README.md) — компонент `Loader`
- [`Logo/`](Logo/README.md) — компонент `Logo`
- [`Modal/`](Modal/README.md) — компонент `Modal`
- [`MultiSelect/`](MultiSelect/README.md) — компонент `MultiSelect`
- [`PasswordInput/`](PasswordInput/README.md) — компонент `PasswordInput`
- [`RadioGroup/`](RadioGroup/README.md) — компонент `RadioGroup`
- [`Select/`](Select/README.md) — компонент `Select`
- [`Stepper/`](Stepper/README.md) — компонент `Stepper`
- [`Tag/`](Tag/README.md) — компонент `Tag`
- [`Textarea/`](Textarea/README.md) — компонент `Textarea`
- [`Toast/`](Toast/README.md) — сообщение с иконкой и кнопкой закрытия; время показа контролирует ToastProvider
