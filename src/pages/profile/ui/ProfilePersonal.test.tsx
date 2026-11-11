import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { citiesReducer } from '@/entities/city';
import { usersReducer } from '@/entities/user';
import { sessionReducer } from '@/entities/session';
import { ProfilePersonal } from './ProfilePersonal';

describe('ProfilePersonal', () => {
  it('отрисовывает форму и аватар пользователя', () => {
    const mockUser = {
      id: 'user-123',
      name: 'Мария',
      email: 'Maria@gmail.com',
      password: 'pwd',
      avatarUrl: '/images/avatars/u01.jpg',
      birthDate: '1995-10-28T10:00:00.000Z',
      gender: 'female' as const,
      cityId: 'msk',
      about: 'О себе',
      teachSkillId: 's01',
      learnSubcategoryIds: [],
      likedUserIds: [],
      likesCount: 10,
      createdAt: '2026-01-01T10:00:00.000Z',
    };

    const store = configureStore({
      reducer: { cities: citiesReducer, users: usersReducer, session: sessionReducer },
      preloadedState: {
        cities: { items: [{ id: 'msk', name: 'Москва' }], status: 'succeeded' as const },
        users: { items: [mockUser], status: 'succeeded' as const, error: null },
        session: { session: { userId: mockUser.id, token: 'mock' } },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePersonal />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Почта/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Имя/i)).toBeInTheDocument();
    // Проверка аватара (alt = имя)
    expect(screen.getByAltText('Мария')).toBeInTheDocument();
  });
});
