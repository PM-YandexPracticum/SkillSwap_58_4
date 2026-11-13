import { createMockCollection } from './createMockCollection'

const keyOf = (item: { id: string; owner: string }) => item.owner

describe('createIfAbsent', () => {
  it('параллельные экземпляры создают одну запись по ключу и возвращают исходную', async () => {
    const one = createMockCollection<{ id: string; owner: string }>('ensure-test', [], {
      delayMs: 0,
    })
    const two = createMockCollection<{ id: string; owner: string }>('ensure-test', [], {
      delayMs: 0,
    })
    const input = { id: 'one', owner: 'owner' }
    const result = await Promise.all([
      one.createIfAbsent(input, keyOf),
      two.createIfAbsent({ ...input, id: 'two' }, keyOf),
    ])
    expect(result).toEqual([input, input])
    expect(await one.getAll()).toEqual([input])
  })

  it('не записывает коллекцию повторно, когда запись уже существует', async () => {
    const collection = createMockCollection('ensure-write', [{ id: 'old', owner: 'owner' }], {
      delayMs: 0,
    })
    const write = vi.spyOn(Storage.prototype, 'setItem')
    expect(await collection.createIfAbsent({ id: 'new', owner: 'owner' }, keyOf)).toEqual({
      id: 'old',
      owner: 'owner',
    })
    expect(write).not.toHaveBeenCalled()
    write.mockRestore()
  })
})
