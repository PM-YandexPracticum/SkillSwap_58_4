import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';

import { citiesReducer } from '@/entities/city';
import { categoriesReducer } from '@/entities/category';
import { skillsReducer } from '@/entities/skill';
import { sessionReducer } from '@/entities/session';
import { exchangesReducer } from '@/entities/exchange';

import { FiltersPanel } from './FiltersPanel';

describe('FiltersPanel', () => {
  it('отрисовывает все заголовки фильтров', () => {
    const store = configureStore({
      reducer: {
        cities: citiesReducer,
        categories: categoriesReducer,
        skills: skillsReducer,
        session: sessionReducer,
        exchanges: exchangesReducer,
      },
      preloadedState: {
        cities: { items: [], status: 'succeeded' as const },
        categories: { items: [], status: 'succeeded' as const },
        skills: { items: [], status: 'succeeded' as const, error: null },
        session: { session: null },
        exchanges: { items: [], status: 'idle' as const, error: null, pendingRequests: 0 },
      },
    });

    render(
      <Provider store={store}>
        <FiltersPanel categories={[]} />
      </Provider>,
    );

    expect(screen.getByText('Фильтры')).toBeInTheDocument();
    expect(screen.getByText('Навыки')).toBeInTheDocument();
    expect(screen.getByText('Пол автора')).toBeInTheDocument();
    expect(screen.getByText('Город')).toBeInTheDocument();
  });
});
