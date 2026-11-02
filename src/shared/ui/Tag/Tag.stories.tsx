import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagColor } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'shared/ui/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Цветной чип навыка на карточке («Игра на барабанах», «+2») ',
          'или плашка с крестиком — выбранный фильтр над результатами ',
          'и выбранное «Хочу научиться» на шаге 2. Один компонент для обоих случаев.',
          '',
          '**Figma:**',
          '- [Чипы на карточке — 1:2861](https://www.figma.com/file/AbCdEf123456/Design-System?node-id=1%3A2861)',
          '- [Плашки фильтров — 1:2860](https://www.figma.com/file/AbCdEf123456/Design-System?node-id=1%3A2860)',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Игра на барабанах', color: 'creativity' },
};

export const Removable: Story = {
  args: { label: 'Москва', onRemove: () => {} },
};

export const PlusTwo: Story = {
  args: { label: '+2', color: 'more' },
};

const colors: TagColor[] = ['business', 'creativity', 'languages', 'education', 'health', 'home', 'more'];

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {colors.map((c) => <Tag key={c} label={c} color={c} />)}
    </div>
  ),
};
