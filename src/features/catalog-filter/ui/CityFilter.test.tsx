import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CityFilter } from './CityFilter';
import { citiesReducer } from '@/entities/city';
import { describe, it, expect } from 'vitest';

const mockCities = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Санкт-Петербург' },
  { id: '3', name: 'Новосибирск' },
  { id: '4', name: 'Екатеринбург' },
  { id: '5', name: 'Казань' },
  { id: '6', name: 'Краснодар' },
];

const renderWithStore = () => {
  const store = configureStore({
    reducer: { cities: citiesReducer },
    preloadedState: { cities: { items: mockCities, status: 'succeeded' as const } },
  });
  return render(
    <Provider store={store}>
      <CityFilter />
    </Provider>
  );
};

describe('CityFilter', () => {
  it('рендерит только первые 5 городов', () => {
    renderWithStore();
    expect(screen.getByText('Казань')).toBeInTheDocument();
    expect(screen.queryByText('Краснодар')).not.toBeInTheDocument();
  });

  it('раскрывает полный список', () => {
    renderWithStore();
    fireEvent.click(screen.getByText(/все города/i));
    expect(screen.getByText('Краснодар')).toBeInTheDocument();
  });
});
