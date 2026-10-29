import { Carousel } from './Carousel'

/**
 * Stories компонента Carousel — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Carousel>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: 4 карточки «Похожие предложения», фото в превью навыка, галерея на странице навыка.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Carousel',
  component: Carousel,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { ariaLabel: 'Похожие предложения', visibleCount: 4 },
}

// TODO: по одной story на каждое состояние из списка выше
