import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, type FieldControlProps } from './Field'

const meta: Meta<typeof Field> = {
  title: 'shared/ui/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Общая доступная обвязка для подписей, ошибок и aria-связей полей.',
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

const renderInput = (placeholder: string) => {
  function RenderInput(control: FieldControlProps) {
    return <input {...control} placeholder={placeholder} />
  }

  return RenderInput
}

export const Default: Story = {
  render: () => <Field label="Имя">{renderInput('Введите ваше имя')}</Field>,
}

export const WithDescription: Story = {
  render: () => (
    <>
      <p id="field-hint">Подсказка формы</p>
      <Field label="Имя" describedBy="field-hint">
        {renderInput('Введите ваше имя')}
      </Field>
    </>
  ),
}

export const Error: Story = {
  render: () => (
    <Field label="Email" error="Введите корректный email">
      {renderInput('name@example.com')}
    </Field>
  ),
}
