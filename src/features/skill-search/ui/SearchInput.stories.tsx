import type { Meta, StoryObj } from '@storybook/react-vite'
import { configureStore } from '@reduxjs/toolkit'
import { expect, userEvent, within } from 'storybook/test'
import { Provider } from 'react-redux'

import { searchReducer } from '../model/searchSlice'
import { SearchInput } from './SearchInput'

const makeStore = () => configureStore({ reducer: { search: searchReducer } })

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2819'

/**
 * Поле поиска из шапки: лупа слева, «×» очистки справа, когда в поле есть текст.
 * Поиск — по Enter или клику на лупу.
 */
const meta: Meta<typeof SearchInput> = {
  title: 'features/skill-search/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: { design: { type: 'figma', url: FIGMA } },
  decorators: [
    (Story) => (
      <Provider store={makeStore()}>
        <div style={{ width: 'min(648px, 80vw)' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

/** Пустое поле с подсказкой «Искать навык» */
export const Empty: Story = {}

/** В поле есть текст — справа виден крестик очистки */
export const WithQuery: Story = {
  args: { defaultValue: 'Игра на барабанах' },
}

/** Крестик очищает поле и возвращает в него фокус */
export const Clearing: Story = {
  args: { defaultValue: 'Гитара' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Очистить поиск' }))
    await expect(canvas.getByRole('textbox', { name: 'Искать навык' })).toHaveValue('')
  },
}
