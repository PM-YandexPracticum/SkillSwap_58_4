import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '@/entities/user';
import { citiesReducer } from '@/entities/city';
import { usersReducer } from '@/entities/user';
import { sessionReducer } from '@/entities/session';

import { ProfilePersonal } from './ProfilePersonal';

// Создаем мок-пользователя
const mockUser: User = {
  id: 'user-123',
  name: 'Мария',
  email: 'Maria@gmail.com',
  password: 'mock-password',
  avatarUrl: '',
  birthDate: '1995-10-28T10:00:00.000Z',
  gender: 'female', // Теперь TS поймет, что это допустимое значение
  cityId: 'msk',
  about: 'Люблю учиться новому...',
  teachSkillId: 's01',
  learnSubcategoryIds: ['time-management', 'yoga', 'english', 'photography'],
  likedUserIds: [],
  likesCount: 10,
  createdAt: '2026-01-01T10:00:00.000Z',
};

const meta: Meta<typeof ProfilePersonal> = {
  title: 'pages/profile/ProfilePersonal',
  component: ProfilePersonal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
  },
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          cities: citiesReducer,
          users: usersReducer,
          session: sessionReducer,
        },
        preloadedState: {
          // Мокаем города (нужны для формы)
          cities: {
            items: [{ id: 'msk', name: 'Москва' }],
            status: 'succeeded' as const,
          },
          // Мокаем список пользователей, чтобы сработал selectUserById
          users: { saveStatus: 'idle' as const, pendingSaves: 0, saveError: null,
            items: [mockUser],
            status: 'succeeded' as const,
            error: null,
          },
          // Мокаем сессию, чтобы компонент понял, что пользователь авторизован
          session: {
            session: { userId: mockUser.id, token: 'mock-token' },
          },
        },
      });

      return (
        <Provider store={store}>
          <MemoryRouter>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
