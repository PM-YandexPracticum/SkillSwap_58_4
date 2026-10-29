import { Modal } from './Modal'

/**
 * Stories компонента Modal — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Modal>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: «Ваше предложение создано», превью навыка (1:2904).
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Modal',
  component: Modal,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { isOpen: true },
}

// TODO: по одной story на каждое состояние из списка выше
