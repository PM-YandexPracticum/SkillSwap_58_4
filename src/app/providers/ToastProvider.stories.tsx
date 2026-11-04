import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastProvider } from './ToastProvider'
import { useToast } from '@/shared/lib/toast'
import { Button } from '@/shared/ui/Button'
import styles from './ToastProvider.stories.module.css'

const meta = {
  title: 'app/providers/ToastProvider',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Настоящий ToastProvider: показ через useToast, крестик и независимое автоисчезновение через 4 секунды. Figma: 1:2148 (1:1975, 1:1976).',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2148',
    },
  },
} satisfies Meta<typeof ToastProvider>

export default meta

type Story = StoryObj<typeof meta>

function Demo() {
  const { showToast } = useToast()
  return (
    <main className={styles.demo}>
      <h1>Уведомления об обмене</h1>
      <p>
        Покажите несколько сообщений: каждое закроется отдельно через 4 секунды или по крестику.
      </p>
      <div className={styles.actions}>
        <Button onClick={() => showToast('Вы предложили обмен Ивану')}>
          Предложить обмен Ивану
        </Button>
        <Button onClick={() => showToast('Вы предложили обмен Анне')}>Предложить обмен Анне</Button>
      </div>
    </main>
  )
}

/** Показ, закрытие, несколько сообщений и таймер 4 с. @see Figma: 1:2148 */
export const Interactive: Story = {
  args: { children: <Demo /> },
}
