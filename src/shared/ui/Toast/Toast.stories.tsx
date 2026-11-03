import { useState, useEffect } from 'react';
import { Toast } from './Toast';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'shared/ui/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Текст сообщения. По ТЗ обычно вида "[name] принял ваш обмен" или "[name] приняла ваш обмен"',
    },
    onClose: {
      table: {
        type: { summary: '() => void' },
      },
      description: 'Обработчик закрытия: вызывается при клике на крестик',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Базовый тост как на макете
 * @see Figma 1:2148 (1:1975, 1:1976) — внешний вид, цвета и отступы
 * Здесь демонстрируется обычный рендер: тост виден, крестик работает (лог в консоль).
 */
export const Default: Story = {
  args: {
    message: 'Олег принял ваш обмен',
    onClose: () => console.log('Toast closed by user click'),
  },
};

/**
 * Демонстрация авто‑исчезновения (ускоренный таймер для стори)
 * В реальном приложении авто‑удаление реализуется в ToastProvider (4 секунды).
 * Здесь таймер стоит 2 секунды только для наглядности в Storybook.
 *
 * Сценарий:
 * - Либо пользователь закрывает тост раньше по крестику (onClose вызывается сразу),
 * - Либо тост исчезает сам через заданное время.
 */
export const AutoDismissDemo: Story = {
  args: {
    message: 'Олег принял ваш обмен',
    onClose: () => console.log('Toast auto-dismissed or closed by user'),
  },
  render: (args) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setVisible(false), 2000); // 2 сек для демо
      return () => clearTimeout(timer);
    }, []);

    return visible ? (
      <Toast {...args} />
    ) : (
      <span style={{ color: '#888', fontSize: 14 }}>
        Тост исчез через 2 сек (демо авто‑закрытия)
      </span>
    );
  },
};
