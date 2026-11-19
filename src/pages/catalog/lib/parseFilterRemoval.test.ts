import { describe, expect, it } from 'vitest'
import { parseFilterRemoval } from './parseFilterRemoval'

describe('parseFilterRemoval', () => {
  it('mode -> { type: "mode" }', () => {
    expect(parseFilterRemoval('mode')).toEqual({ type: 'mode' })
  })

  it('gender -> { type: "gender" }', () => {
    expect(parseFilterRemoval('gender')).toEqual({ type: 'gender' })
  })

  it('не принимает сортировку как снимаемую плашку', () => {
    expect(() => parseFilterRemoval('sort')).toThrow()
  })

  it('skill:photo -> subcategory с id photo', () => {
    expect(parseFilterRemoval('skill:photo')).toEqual({ type: 'subcategory', id: 'photo' })
  })

  it('city:msk -> city с id msk', () => {
    expect(parseFilterRemoval('city:msk')).toEqual({ type: 'city', id: 'msk' })
  })

  it('неизвестный id бросает ошибку', () => {
    expect(() => parseFilterRemoval('unknown')).toThrow()
    expect(() => parseFilterRemoval('sub:photo')).toThrow()
  })
})
