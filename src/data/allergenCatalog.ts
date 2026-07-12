/**
 * I 14 allergeni regolamentati UE (Reg. 1169/2011), mappati sui tag
 * canonici di Open Food Facts (senza prefisso lingua).
 */
export interface AllergenInfo {
  /** tag OFF canonico senza prefisso lingua, es. "milk" */
  tag: string
  label: string
  emoji: string
}

export const ALLERGEN_CATALOG: AllergenInfo[] = [
  { tag: 'gluten', label: 'Glutine', emoji: '🌾' },
  { tag: 'crustaceans', label: 'Crostacei', emoji: '🦐' },
  { tag: 'eggs', label: 'Uova', emoji: '🥚' },
  { tag: 'fish', label: 'Pesce', emoji: '🐟' },
  { tag: 'peanuts', label: 'Arachidi', emoji: '🥜' },
  { tag: 'soybeans', label: 'Soia', emoji: '🫘' },
  { tag: 'milk', label: 'Latte', emoji: '🥛' },
  { tag: 'nuts', label: 'Frutta a guscio', emoji: '🌰' },
  { tag: 'celery', label: 'Sedano', emoji: '🥬' },
  { tag: 'mustard', label: 'Senape', emoji: '🟡' },
  { tag: 'sesame-seeds', label: 'Sesamo', emoji: '⚪' },
  { tag: 'sulphur-dioxide-and-sulphites', label: 'Solfiti', emoji: '🍷' },
  { tag: 'lupin', label: 'Lupini', emoji: '🌸' },
  { tag: 'molluscs', label: 'Molluschi', emoji: '🦪' },
]

/** Rimuove il prefisso lingua da un tag OFF ("en:milk" -> "milk") */
export function normalizeTag(tag: string): string {
  const i = tag.indexOf(':')
  return (i >= 0 ? tag.slice(i + 1) : tag).toLowerCase()
}

export function labelForTag(tag: string): string {
  const norm = normalizeTag(tag)
  const found = ALLERGEN_CATALOG.find((a) => a.tag === norm)
  if (found) return found.label
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
