import { render, screen } from '@testing-library/react';
import { FiltersPanel } from './FiltersPanel';
import { describe, it, expect } from 'vitest';

describe('FiltersPanel', () => {
  it('отрисовывает все заголовки фильтров', () => {
    render(<FiltersPanel categories={[]} cities={[]} />);

    expect(screen.getByText('Фильтры')).toBeInTheDocument();
    expect(screen.getByText('Навыки')).toBeInTheDocument();
    expect(screen.getByText('Пол автора')).toBeInTheDocument();
    expect(screen.getByText('Город')).toBeInTheDocument();
  });
});
