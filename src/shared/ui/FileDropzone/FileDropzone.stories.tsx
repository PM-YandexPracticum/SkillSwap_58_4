import { FileDropzone } from './FileDropzone'

/**
 * Stories компонента FileDropzone — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof FileDropzone>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: пустая зона, перетаскивание (подсветка), с превью, ошибка («Файл больше 1 МБ»).
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: {
    hint: 'Перетащите или выберите изображения навыка',
    buttonLabel: 'Выбрать изображения',
    multiple: true,
  },
}

// TODO: по одной story на каждое состояние из списка выше
