import { getScaledSize } from './getScaledSize'

describe('getScaledSize', () => {
  it('уменьшает горизонтальное фото по ширине', () => {
    expect(getScaledSize(3000, 2000)).toEqual({ width: 800, height: 533 })
  })

  it('уменьшает вертикальное фото по высоте', () => {
    expect(getScaledSize(2000, 3000)).toEqual({ width: 533, height: 800 })
  })

  it('не трогает фото, которое подходит под лимит', () => {
    expect(getScaledSize(400, 300)).toEqual({ width: 400, height: 300 })
  })

  it('не трогает фото ровно 800 px', () => {
    expect(getScaledSize(800, 800)).toEqual({ width: 800, height: 800 })
  })

  it('уменьшает квадрат, если лимит меньше его стороны', () => {
    expect(getScaledSize(800, 800, 500)).toEqual({ width: 500, height: 500 })
  })
})
