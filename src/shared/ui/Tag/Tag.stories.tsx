import { Tag } from './Tag'
import categories from '../../api/mock-db/seed/categories.json'

const meta = {
  title: 'shared/ui/Tag',
  component: Tag,
  tags: ['autodocs'],
}

export default meta

export const Default = {
  args: { label: 'Игра на барабанах' },
}

export const Removable = {
  args: { label: 'Москва', onRemove: () => {} },
}

export const PlusTwo = {
  args: { label: '+2', color: '#E6E2F5' },
}

export const AllCategories = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {categories.map((category) => (
        <Tag key={category.id} label={category.title} color={category.color} />
      ))}
    </div>
  ),
}
