import { render, screen, fireEvent } from '@testing-library/react';
import { ResetFiltersButton } from './ResetFiltersButton';
import { vi, describe, it, expect } from 'vitest';

describe('ResetFiltersButton', () => {
  it('вызывает onClick при клике', () => {
    const onClickMock = vi.fn();
    render(<ResetFiltersButton onClick={onClickMock} />);

    const button = screen.getByRole('button', { name: /сбросить/i });
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
