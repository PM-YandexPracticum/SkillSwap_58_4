import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';
import { vi, describe, it, expect } from 'vitest';

describe('Tag', () => {
  it('без onRemove рендерит чип без крестика', () => {
    render(<Tag label="Игра на барабанах" color="creativity" />);

    expect(screen.getByText('Игра на барабанах')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('с onRemove рендерит крестик и вызывает колбэк по клику', () => {
    const onRemove = vi.fn();
    render(<Tag label="Москва" color="home" onRemove={onRemove} />);

    const removeButton = screen.getByRole('button', { name: /удалить москва/i });
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('применяет цвет, переданный снаружи', () => {
    render(<Tag label="+2" color="more" />);
    const tag = screen.getByText('+2').parentElement!;

    expect(tag.style.backgroundColor).not.toBe('');
  });
});
