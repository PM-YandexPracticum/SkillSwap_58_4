import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { userEvent, within } from 'storybook/test'
import EditIcon from '@/shared/assets/icons/edit.svg?react'
import { Button } from '@/shared/ui/Button'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'shared/ui/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Имя', placeholder: 'Введите ваше имя' },
  parameters: {
    docs: {
      description: {
        component: 'Поле по макету SkillSwap. Карандаш декоративный, ввод доступен сразу.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(436px, 80vw)' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = { args: { defaultValue: 'Мария' } }

/** Карандаш виден в UI и не создаёт дополнительную кнопку. Профиль, 1:2370. */
export const WithIcon: Story = {
  args: { defaultValue: 'Мария', rightIcon: <EditIcon /> },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
  },
}

export const Error: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'petrov@mail.ru',
    error: 'Email уже используется',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627',
    },
  },
}

export const Disabled: Story = {
  args: { defaultValue: 'Мария', disabled: true, rightIcon: <EditIcon /> },
}

/** Для просмотра состояния наведите курсор на поле. */
export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Наведите курсор на поле: рамка изменит цвет. У disabled эффект отключён.',
      },
    },
  },
}

/** Поле в фокусе; нажатие клавиши показывает клавиатурное выделение. */
export const Focus: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('textbox').focus()
    await userEvent.keyboard('{ArrowRight}')
  },
}

export const ReactHookForm: Story = {
  render: function Form(args) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<{ text: string }>()
    const [saved, setSaved] = useState('')
    return (
      <form
        style={{ display: 'grid', gap: 'var(--space-16)' }}
        onSubmit={handleSubmit((data) => setSaved(data.text))}
      >
        <Input
          {...args}
          {...register('text', { required: 'Заполните поле' })}
          error={errors.text?.message}
        />
        <Button type="submit">Сохранить</Button>
        <output aria-live="polite">{saved && `Сохранено: ${saved}`}</output>
      </form>
    )
  },
}
