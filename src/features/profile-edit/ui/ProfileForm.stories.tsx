import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { citiesReducer } from '@/entities/city';
import { ProfileForm } from './ProfileForm';

const mockCities = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург' },
  { id: 'nsk', name: 'Новосибирск' },
  { id: 'ekb', name: 'Екатеринбург' },
  { id: 'kzn', name: 'Казань' },
  { id: 'krd', name: 'Краснодар' },
];

const meta: Meta<typeof ProfileForm> = {
  title: 'features/profile-edit/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2370',
    },
  },
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: { cities: citiesReducer },
        preloadedState: {
          cities: { items: mockCities, status: 'succeeded' as const },
        },
      });

      return (
        <Provider store={store}>
          <div style={{ width: 400 }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
