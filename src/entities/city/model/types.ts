import type { ID } from '@/shared/types'

/** Город из справочника — простая сущность: id и название */
export interface City {
  id: ID
  name: string
}
