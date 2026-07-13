import type { Lang } from '../i18n/translations'

/**
 * I 14 allergeni regolamentati UE (Reg. 1169/2011), mappati sui tag
 * canonici di Open Food Facts (senza prefisso lingua).
 */
export interface AllergenInfo {
  /** tag OFF canonico senza prefisso lingua, es. "milk" */
  tag: string
  label: { it: string; en: string }
  emoji: string
}

export const ALLERGEN_CATALOG: AllergenInfo[] = [
  { tag: 'gluten', label: { it: 'Glutine', en: 'Gluten' }, emoji: '🌾' },
  { tag: 'crustaceans', label: { it: 'Crostacei', en: 'Crustaceans' }, emoji: '🦐' },
  { tag: 'eggs', label: { it: 'Uova', en: 'Eggs' }, emoji: '🥚' },
  { tag: 'fish', label: { it: 'Pesce', en: 'Fish' }, emoji: '🐟' },
  { tag: 'peanuts', label: { it: 'Arachidi', en: 'Peanuts' }, emoji: '🥜' },
  { tag: 'soybeans', label: { it: 'Soia', en: 'Soy' }, emoji: '🫘' },
  { tag: 'milk', label: { it: 'Latte', en: 'Milk' }, emoji: '🥛' },
  { tag: 'nuts', label: { it: 'Frutta a guscio', en: 'Tree nuts' }, emoji: '🌰' },
  { tag: 'celery', label: { it: 'Sedano', en: 'Celery' }, emoji: '🥬' },
  { tag: 'mustard', label: { it: 'Senape', en: 'Mustard' }, emoji: '🟡' },
  { tag: 'sesame-seeds', label: { it: 'Sesamo', en: 'Sesame' }, emoji: '⚪' },
  { tag: 'sulphur-dioxide-and-sulphites', label: { it: 'Solfiti', en: 'Sulphites' }, emoji: '🍷' },
  { tag: 'lupin', label: { it: 'Lupini', en: 'Lupin' }, emoji: '🌸' },
  { tag: 'molluscs', label: { it: 'Molluschi', en: 'Molluscs' }, emoji: '🦪' },
]

/** Rimuove il prefisso lingua da un tag OFF ("en:milk" -> "milk") */
export function normalizeTag(tag: string): string {
  const i = tag.indexOf(':')
  return (i >= 0 ? tag.slice(i + 1) : tag).toLowerCase()
}

export function labelForTag(tag: string, lang: Lang): string {
  const norm = normalizeTag(tag)
  const found = ALLERGEN_CATALOG.find((a) => a.tag === norm)
  if (found) return found.label[lang]
  // tag fuori catalogo: rendilo leggibile ("some-tag" -> "Some tag")
  const readable = norm.replace(/-/g, ' ')
  return readable.charAt(0).toUpperCase() + readable.slice(1)
}

/**
 * Interseca gli allergeni del prodotto (tag OFF grezzi) con quelli
 * del profilo (tag normalizzati). Ritorna i tag normalizzati in comune.
 */
export function matchAllergens(
  productTags: string[] | undefined,
  profileAllergens: string[],
): string[] {
  if (!productTags || productTags.length === 0) return []
  const product = new Set(productTags.map(normalizeTag))
  return profileAllergens.filter((a) => product.has(a))
}
