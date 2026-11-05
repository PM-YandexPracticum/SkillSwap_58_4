import { render, screen, fireEvent } from '@testing-library/react';
import { CityFilter } from './CityFilter';
import { describe, it, expect } from 'vitest';

// Моки городов (передаем 6 городов, чтобы проверить работу кнопки)
const mockCities = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Санкт-Петербург' },
  { id: '3', name: 'Новосибирск' },
  { id: '4', name: 'Екатеринбург' },
  { id: '5', name: 'Казань' },
  { id: '6', name: 'Краснодар' },
];

describe('CityFilter', () => {
  it('рендерит только первые 5 городов и скрывает остальные', () => {
    render(<CityFilter cities={mockCities} />);

    expect(screen.getByText('Казань')).toBeInTheDocument();
    expect(screen.queryByText('Краснодар')).not.toBeInTheDocument();
  });

  it('раскрывает полный список при клике на "Все города"', () => {
    render(<CityFilter cities={mockCities} />);

    // Находим кнопку и кликаем
    const showAllButton = screen.getByText(/все города/i);
    fireEvent.click(showAllButton);

    expect(screen.getByText('Краснодар')).toBeInTheDocument();
    expect(screen.getByText(/свернуть/i)).toBeInTheDocument();
  });
});
