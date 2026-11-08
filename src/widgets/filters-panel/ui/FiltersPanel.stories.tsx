import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { citiesReducer } from '@/entities/city';
import { categoriesReducer, type Category } from '@/entities/category';
import { skillsReducer } from '@/entities/skill';
import { sessionReducer } from '@/entities/session';
import { exchangesReducer } from '@/entities/exchange';

import { FiltersPanel } from './FiltersPanel';

const mockCategories: Category[] = [
  {
    id: 'business',
    title: 'Бизнес и карьера',
    icon: 'briefcase',
    color: '#EEE7F7',
    subcategories: [{ id: 'management', categoryId: 'business', title: 'Менеджмент' }],
  },
  {
    id: 'creativity',
    title: 'Творчество и искусство',
    icon: 'palette',
    color: '#F7E7F2',
    subcategories: [{ id: 'drawing', categoryId: 'creativity', title: 'Рисование' }],
  },

  {
    id: 'languages',
    title: 'Иностранные языки',
    icon: 'languages',
    color: '#EBE5C5',
    subcategories: []
  },
  {
    id: 'education',
    title: 'Образование и развитие',
    icon: 'education',
    color: '#E7F2F6', subcategories: []
  },
  {
    id: 'health',
    title: 'Здоровье и лайфстайл',
    icon: 'health',
    color: '#E9F7E7',
    subcategories: []
  },
  {
    id: 'home',
    title: 'Дом и уют',
    icon: 'home',
    color: '#F7EBE5',
    subcategories: []
  },
  {
    id: 'extra',
    title: 'Еще одна категория',
    icon: 'briefcase',
    color: '#EEE7F7',
    subcategories: []
  },
];

const mockCities = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург' },
  { id: 'nsk', name: 'Новосибирск' },
  { id: 'ekb', name: 'Екатеринбург' },
  { id: 'kzn', name: 'Казань' },
  { id: 'krd', name: 'Краснодар' },
  { id: 'vld', name: 'Владивосток' },
];

const meta: Meta<typeof FiltersPanel> = {
  title: 'widgets/filters-panel/FiltersPanel',
  component: FiltersPanel,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          cities: citiesReducer,
          categories: categoriesReducer,
          skills: skillsReducer,
          session: sessionReducer,
          exchanges: exchangesReducer,
        },
        preloadedState: {
          cities: { items: mockCities, status: 'succeeded' as const },
          categories: { items: mockCategories, status: 'succeeded' as const },
          skills: { items: [], status: 'succeeded' as const, error: null },
          session: { session: null },
          exchanges: { items: [], status: 'idle' as const, error: null, pendingRequests: 0 },
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

export const Default: Story = {
  args: {
    categories: mockCategories,
    filtersCount: 2,
  },
};
