import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { citiesReducer } from '@/entities/city';
import { usersReducer } from '@/entities/user';
import { sessionReducer } from '@/entities/session';

import { ProfilePage } from './ProfilePage';
import { ProfilePersonal } from './ProfilePersonal';

const mockUser = {
  id: 'user-123',
  name: 'Мария',
  email: 'Maria@gmail.com',
  password: 'mock-password',
  avatarUrl: '/images/avatars/u01.jpg',
  birthDate: '1995-10-28T10:00:00.000Z',
  gender: 'female' as const,
  cityId: 'msk',
  about: 'Люблю учиться новому...',
  teachSkillId: 's01',
  learnSubcategoryIds: [],
  likedUserIds: [],
  likesCount: 10,
  createdAt: '2026-01-01T10:00:00.000Z',
};

const meta: Meta<typeof ProfilePage> = {
  title: 'pages/profile/ProfilePage',
  component: ProfilePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
    docs: {
      story: {
        inline: false,
        height: '100vh',
      },
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
          cities: {
            items: [{ id: 'msk', name: 'Москва' }],
            status: 'succeeded' as const,
          },
          users: {
            items: [mockUser],
            status: 'succeeded' as const,
            error: null,
          },
          session: {
            session: { userId: mockUser.id, token: 'mock-token' },
          },
        },
      });

      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/profile']}>
            <Routes>
              <Route path="/profile" element={<Story />}>
                <Route index element={<ProfilePersonal />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
