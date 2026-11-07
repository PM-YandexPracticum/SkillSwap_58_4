import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';

import { categoriesReducer } from '@/entities/category';
import { citiesReducer } from '@/entities/city';
import { exchangesReducer } from '@/entities/exchange';
import { sessionReducer } from '@/entities/session';
import { skillsReducer } from '@/entities/skill';
import { createSkill } from '@/entities/skill/testing';
import { createUser } from '@/entities/user/testing';

import { OfferCard } from './OfferCard';


const testUser = createUser({
  id: 'user-123',
  teachSkillId: 'skill-1',
});


const renderWithStore = (preloadedState: any) => {
  const store = configureStore({
    reducer: {
      cities: citiesReducer,
      categories: categoriesReducer,
      skills: skillsReducer,
      session: sessionReducer,
      exchanges: exchangesReducer,
    },
    preloadedState: preloadedState,
  } as any);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <OfferCard user={testUser} />
      </MemoryRouter>
    </Provider>
  );
};

describe('OfferCard (P7-04)', () => {
  const baseState = {
    cities: { items: [{ id: testUser.cityId, name: 'Москва' }], status: 'succeeded' },
    categories: { items: [], status: 'succeeded' },
    skills: {
      items: [createSkill({ id: 'skill-1', title: 'Навык', categoryId: 'cat-1', subcategoryId: 'sub-1' })],
      status: 'succeeded',
      error: null,
    },
  };

  it('показывает кнопку «Подробнее», если обмен НЕ предложен', () => {
    renderWithStore({
      ...baseState,
      session: { session: { userId: 'current-user-id', token: 'mock' } },
      exchanges: { items: [], status: 'succeeded', error: null, pendingRequests: 0 },
    });

    expect(screen.getByText('Подробнее')).toBeInTheDocument();
    expect(screen.queryByText('Обмен предложен')).not.toBeInTheDocument();
  });

  it('показывает бейдж «Обмен предложен», если текущий пользователь предложил обмен', () => {
    renderWithStore({
      ...baseState,
      // Текущий пользователь - это тот, кто предложил
      session: { session: { userId: 'current-user-id', token: 'mock' } },
      exchanges: {
        items: [
          {
            id: 'exchange-1',
            fromUserId: 'current-user-id', // Отправитель
            toUserId: testUser.id,         // Получатель (автор карточки)
            skillId: 'skill-1',
            createdAt: new Date().toISOString(),
          },
        ],
        status: 'succeeded',
        error: null,
        pendingRequests: 0,
      },
    });

    expect(screen.getByText('Обмен предложен')).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).not.toBeInTheDocument();
  });
});
