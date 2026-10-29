import { Avatar } from './Avatar'

/**
 * Stories компонента Avatar — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Avatar>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: размеры sm / md / lg, без фото (заглушка).
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { src: '/images/avatars/u01.jpg', alt: 'Иван', size: 'md' },
}

// TODO: по одной story на каждое состояние из списка выше
