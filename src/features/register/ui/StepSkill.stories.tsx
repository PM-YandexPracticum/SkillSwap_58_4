import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepSkill } from './StepSkill'

const MockSkillForm = () => (
  <form aria-label="Форма навыка" style={{ padding: '20px', border: '1px dashed #ccc' }}>
    <p>Здесь будет форма навыка (SkillForm)</p>
  </form>
)

const MockPreviewModal = () => (
  <div
    role="dialog"
    aria-label="Ваше предложение"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{ background: 'white', padding: '20px' }}>
      <h2>Ваше предложение</h2>
      <p>Превью навыка (SkillPreviewModal)</p>
    </div>
  </div>
)

const meta: Meta<typeof StepSkill> = {
  title: 'features/register/StepSkill',
  component: StepSkill,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1761',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithForm: Story = {
  args: {
    skillForm: <MockSkillForm />,
  },
}

export const WithPreview: Story = {
  args: {
    skillForm: <MockSkillForm />,
    previewModal: <MockPreviewModal />,
  },
}
