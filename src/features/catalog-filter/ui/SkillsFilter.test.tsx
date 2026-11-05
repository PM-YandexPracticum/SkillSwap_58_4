import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsFilter } from './SkillsFilter';
import { describe, it, expect } from 'vitest';

const mockCategories = [
  {
    id: 'business',
    title: 'Бизнес и карьера',
    icon: 'briefcase',
    color: '#fff',
    subcategories: [
      { id: 'management', categoryId: 'business', title: 'Менеджмент' }
    ],
  },
];

describe('SkillsFilter', () => {
  it('скрывает подкатегории по умолчанию', () => {
    render(<SkillsFilter categories={mockCategories} />);

    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();
    expect(screen.queryByText('Менеджмент')).not.toBeInTheDocument();
  });

  it('показывает подкатегории при клике на стрелочку', () => {
    render(<SkillsFilter categories={mockCategories} />);

    const toggleButton = screen.getByLabelText(/развернуть категорию/i);
    fireEvent.click(toggleButton);

    expect(screen.getByText('Менеджмент')).toBeInTheDocument();
  });
});
