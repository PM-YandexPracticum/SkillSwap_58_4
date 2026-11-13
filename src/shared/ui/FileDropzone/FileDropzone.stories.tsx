import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { FileDropzone } from './FileDropzone'

/**
 * Зона загрузки изображений — пунктирная рамка с подписью и кнопкой выбора.
 *
 * Поведение:
 * - клик по всей пунктирной зоне открывает диалог выбора файла;
 * - кнопка «Выбрать изображения» дублирует клик и доступна с клавиатуры;
 * - превью и ошибка отображаются под зоной.
 *
 * Проверка файлов выполняется у родителя через `validateImageFile`,
 * компонент отвечает только за выбор и передачу `File[]`.
 *
 * Пунктирная рамка 1 px и радиус 12 px — по макету. Прозрачность 80% оставлена
 * только у рамки: прозрачность всей зоны ухудшала контраст текста (согласовано в P3-13).
 * Фрейм 1:1761 «Регистрация 3 шаг».
 *
 * Состояния hover и focus в макете не нарисованы — креатив:
 * при наведении рамка становится акцентной,
 * с клавиатуры видно кольцо фокуса.
 */
const meta: Meta<typeof FileDropzone> = {
  title: 'shared/ui/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Зона загрузки изображений: drag & drop или выбор через скрытый input. Проверку файлов выполняет родитель.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

const defaultArgs = {
  hint: 'Перетащите или выберите изображения навыка',
  buttonLabel: 'Выбрать изображения',
  multiple: true,
  onFiles: fn(),
}

/** Пустая зона по макету. Фрейм 1:1761. */
export const Default: Story = {
  args: defaultArgs,
}

/**
 * Наведение мыши на зону — рамка акцентная (креатив, в макете не нарисовано).
 * Наведите курсор на зону: программный `userEvent.hover` не включает CSS `:hover`, поэтому состояние не включается само.
 */
export const Hover: Story = {
  args: defaultArgs,
}

/**
 * Кольцо фокуса на кнопке выбора — Tab с клавиатуры (креатив, в макете не нарисовано).
 * `:focus-visible` срабатывает только от клавиатурного ввода, поэтому `userEvent.tab()`,
 * а не `.focus()`.
 */
export const Focus: Story = {
  args: defaultArgs,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await step('Фокус на кнопке выбора', () => {
      expect(canvas.getByRole('button', { name: 'Выбрать изображения' })).toHaveFocus()
    })
  },
}

/**
 * Перетаскивание файла над зоной — рамка сплошная акцентная (креатив, в макете не нарисовано).
 * Событие `dragenter` посылается вручную: живой drag из проводника
 * в iframe Storybook не доходит.
 */
export const Dragging: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const zone = canvasElement.querySelector('[data-testid="filedropzone-zone"]')
    if (!zone) return
    zone.dispatchEvent(new DragEvent('dragenter', { bubbles: true }))
  },
}

/** Одно превью 80×80 с крестиком удаления — крестик и подложка креативные. */
export const WithPreview: Story = {
  args: {
    ...defaultArgs,
    previews: [{ url: '/images/skills/s01-1.jpg', onRemove: fn() }],
  },
}

/** Несколько превью — переносятся на новую строку через flex-wrap. */
export const WithMultiplePreviews: Story = {
  args: {
    ...defaultArgs,
    previews: [
      { url: '/images/skills/s01-1.jpg', onRemove: fn() },
      { url: '/images/skills/s01-2.jpg', onRemove: fn() },
      { url: '/images/skills/s01-3.jpg', onRemove: fn() },
    ],
  },
}

/** Ошибка валидации — текст под зоной с `role="alert"`. */
export const WithError: Story = {
  args: {
    ...defaultArgs,
    error: 'Файл больше 1 МБ',
  },
}

/** Недоступное состояние — кнопки неактивны, выбор и drag & drop не работают. */
export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
}

/** Лимит достигнут: добавление недоступно, удаление превью работает. Креативное состояние P3-13. */
export const UploadDisabled: Story = {
  args: {
    ...defaultArgs,
    uploadDisabled: true,
    previews: [{ url: '/images/skills/s01-1.jpg', onRemove: fn() }],
  },
}

/** Одиночный выбор — так компонент используется для загрузки аватара. */
export const SingleFile: Story = {
  args: {
    hint: 'Перетащите или выберите изображение',
    buttonLabel: 'Выбрать изображение',
    onFiles: fn(),
  },
}
