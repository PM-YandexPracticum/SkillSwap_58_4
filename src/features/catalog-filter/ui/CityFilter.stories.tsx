import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { citiesReducer } from '@/entities/city';
import { CityFilter } from './CityFilter';

const mockCities = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург' },
  { id: 'nsk', name: 'Новосибирск' },
  { id: 'ekb', name: 'Екатеринбург' },
  { id: 'kzn', name: 'Казань' },
  { id: 'krd', name: 'Краснодар' },
  { id: 'vld', name: 'Владивосток' },
];

const meta: Meta<typeof CityFilter> = {
  title: 'features/catalog-filter/CityFilter',
  component: CityFilter,
  tags: ['autodocs'],
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
          <Story />
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
