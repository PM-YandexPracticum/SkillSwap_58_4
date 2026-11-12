import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorBoundary } from './ErrorBoundary'

function BrokenPage(): never {
  throw new Error('Демонстрационная ошибка рендера')
}

const meta = {
  title: 'app/providers/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Корневая граница без роутера и store. При ошибке показывает готовый экран 500; «На главную» полностью перезапускает приложение. «Сообщить об ошибке» — заглушка. В WithError сообщение в консоли ожидаемо. Figma: 1:2077.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2077',
    },
  },
} satisfies Meta<typeof ErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const Normal: Story = {
  args: {
    children: (
      <main>
        <h1>Рабочая страница</h1>
      </main>
    ),
  },
}

export const WithError: Story = {
  args: { children: <BrokenPage /> },
}
