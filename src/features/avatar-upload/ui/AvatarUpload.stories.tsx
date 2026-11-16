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
        component:
          'Аватар второго шага регистрации. Кнопка «+» открывает выбор файла (jpg, png, webp до 1 МБ): проверку делает `validateImageFile`, уменьшение до 800 px — `fileToDataUrl`, в `onChange` приходит готовый data URL. Ошибка файла показывается под аватаром. Фото хранит тот, кто использует компонент: черновик регистрации (P6-04) или личные данные (P7-06).',
      },
    },
  },
} satisfies Meta<typeof AvatarUpload>
export default meta
type Story = StoryObj<typeof meta>

/** Без фото, как в макете 1:1497; выбрать файл можно кнопкой «+» */
export const Default: Story = {}

/** С выбранным фото */
export const WithPhoto: Story = { args: { value: IMAGE_PLACEHOLDERS.AVATAR } }

/** Ошибка поля под аватаром */
export const WithError: Story = { args: { error: 'Файл больше 1 МБ' } }
