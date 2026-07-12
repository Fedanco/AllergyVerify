export interface Nutriments {
  'energy-kcal_100g'?: number
  carbohydrates_100g?: number
  fat_100g?: number
  'saturated-fat_100g'?: number
  proteins_100g?: number
  sugars_100g?: number
  salt_100g?: number
  sodium_100g?: number
  fiber_100g?: number
}

export interface Product {
  code: string
  product_name?: string
  brands?: string
  image_front_url?: string
  allergens_tags?: string[]
  categories_tags?: string[]
  nutriments?: Nutriments
  nutriscore_grade?: string
}

/** Voce ridotta salvata nello storico locale */
export interface HistoryEntry {
  code: string
  name: string
  brands: string
  imageUrl: string
  allergensTags: string[]
  scannedAt: number
  source: 'scan' | 'search'
}

export interface AllergyProfile {
  id: string
  name: string
  /** tag OFF senza prefisso lingua, es. "milk", "gluten" */
  allergens: string[]
}

export type LookupErrorKind = 'not-found' | 'offline' | 'timeout' | 'error'

export class LookupError extends Error {
  kind: LookupErrorKind
  constructor(kind: LookupErrorKind, message: string) {
    super(message)
    this.kind = kind
  }
}
