import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IMAGE_PLACEHOLDERS } from '@/shared/lib/image'
import { AvatarUpload } from './AvatarUpload'

const meta = {
  title: 'features/avatar-upload/AvatarUpload',
  component: AvatarUpload,
  tags: ['autodocs'],
  args: { value: null, onChange: fn() },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1497',
    },
    docs: {
      description: {
        component: 'Вёрстка P3-12. Выбор, проверка и сохранение файла подключаются в P6-04.',
      },
    },
  },
} satisfies Meta<typeof AvatarUpload>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const WithPhoto: Story = { args: { value: IMAGE_PLACEHOLDERS.AVATAR } }
