import { Button } from './Button'

/**
 * Stories компонента Button — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Button>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: primary, secondary («Войти»), ghost («Смотреть все»), disabled.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Primary = {
  args: { variant: 'primary', children: 'Подробнее' },
}

export const Secondary = {
  args: { variant: 'secondary', children: 'Войти' },
}

export const Ghost = {
  args: { variant: 'ghost', children: 'Смотреть все' },
}

export const Disabled = {
  args: { variant: 'primary', children: 'Подробнее', disabled: true },
}
// TODO: по одной story на каждое состояние из списка выше
