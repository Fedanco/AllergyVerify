import type { Lang } from '../i18n/translations'
import type { HistoryEntry, Product } from '../types/product'

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

/** Emoji del catalogo per un tag, se e' un allergene dei 14 UE. */
export function emojiForTag(tag: string): string | undefined {
  return ALLERGEN_CATALOG.find((a) => a.tag === normalizeTag(tag))?.emoji
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

// Parole chiave per riconoscere un allergene nel testo ingredienti quando OFF
// non lo dichiara nei tag `allergens_tags` (dato compilato a mano dalla
// community, spesso incompleto o mancante). Fonte unica di verità: usata sia
// qui per il matching del verdetto, sia in IngredientsCard per l'highlight
// visivo. Copre IT/EN oltre a FR/DE/ES/PT: i prodotti europei su OFF hanno
// spesso il testo ingredienti in una lingua diversa da quella dell'app (es.
// packaging multilingua OCR-ato in una sola lingua a caso — es. su Nutella
// venduto in Francia, ingredients_text_en su OFF è spesso testo OCR
// spazzatura non allineato al prodotto, quindi non va usato come fonte
// primaria) — senza queste varianti il fallback testuale mancherebbe
// comunque il match.
export const ALLERGEN_KEYWORDS: Record<string, string[]> = {
  gluten: ['glutine', 'grano', 'frumento', 'orzo', 'segale', 'avena', 'farro', 'kamut', 'gluten', 'wheat', 'barley', 'rye', 'oat', 'blé', 'froment', 'orge', 'seigle', 'avoine', 'épeautre', 'weizen', 'gerste', 'roggen', 'hafer', 'dinkel', 'trigo', 'cebada', 'centeno', 'centeio', 'espelta'],
  crustaceans: ['crostacei', 'gambero', 'gamberi', 'granchio', 'aragosta', 'scampi', 'crustaceans', 'shrimp', 'crab', 'lobster', 'crustacés', 'crevette', 'homard', 'krebstiere', 'garnele', 'krabbe', 'hummer', 'crustáceos', 'camarón', 'camarão', 'cangrejo', 'caranguejo', 'langosta', 'lagosta'],
  eggs: ['uova', 'uovo', 'albume', 'tuorlo', 'egg', 'eggs', 'œuf', 'oeuf', 'oeufs', 'ei', 'eier', 'huevo', 'huevos', 'ovo', 'ovos'],
  fish: ['pesce', 'acciughe', 'acciuga', 'tonno', 'salmone', 'merluzzo', 'fish', 'anchovy', 'tuna', 'salmon', 'cod', 'poisson', 'anchois', 'thon', 'saumon', 'cabillaud', 'fisch', 'sardelle', 'thunfisch', 'lachs', 'kabeljau', 'pescado', 'anchoa', 'atún', 'salmón', 'bacalao', 'peixe', 'anchova', 'atum', 'salmão', 'bacalhau'],
  peanuts: ['arachidi', 'arachide', 'peanut', 'peanuts', 'cacahuète', 'cacahouète', 'erdnuss', 'cacahuete', 'maní', 'amendoim'],
  soybeans: ['soia', 'soy', 'soja', 'sojabohne'],
  milk: ['latte', 'lattosio', 'panna', 'burro', 'siero di latte', 'formaggio', 'caseina', 'milk', 'lactose', 'cream', 'butter', 'whey', 'cheese', 'casein', 'lait', 'beurre', 'crème', 'fromage', 'caséine', 'petit-lait', 'milch', 'laktose', 'sahne', 'käse', 'kasein', 'molke', 'leche', 'lactosa', 'mantequilla', 'nata', 'queso', 'caseína', 'suero', 'leite', 'manteiga', 'queijo', 'soro de leite'],
  nuts: ['nocciole', 'nocciola', 'mandorle', 'mandorla', 'noci', 'noce', 'pistacchi', 'pistacchio', 'anacardi', 'anacardo', 'frutta a guscio', 'hazelnut', 'almond', 'walnut', 'pistachio', 'cashew', 'nuts', 'noisette', 'amande', 'noix', 'pistache', 'haselnuss', 'mandel', 'walnuss', 'pistazie', 'avellana', 'almendra', 'nuez', 'pistacho', 'avelã', 'amêndoa', 'castanha de caju'],
  celery: ['sedano', 'celery', 'céleri', 'sellerie', 'apio', 'aipo'],
  mustard: ['senape', 'mustard', 'moutarde', 'senf', 'mostaza', 'mostarda'],
  'sesame-seeds': ['sesamo', 'sesame', 'sésame', 'sesam', 'sésamo', 'gergelim'],
  'sulphur-dioxide-and-sulphites': ['solfiti', 'solfito', 'anidride solforosa', 'sulphites', 'sulfites', 'sulphur dioxide', 'sulfites', 'anhydride sulfureux', 'sulfite', 'schwefeldioxid', 'sulfitos', 'dióxido de azufre', 'dióxido de enxofre', 'metabissulfito'],
  lupin: ['lupini', 'lupino', 'lupin', 'lupine', 'altramuz', 'tremoço'],
  molluscs: ['molluschi', 'mollusco', 'vongole', 'cozze', 'seppia', 'calamaro', 'polpo', 'molluscs', 'clam', 'mussel', 'squid', 'octopus', 'mollusques', 'moule', 'calmar', 'poulpe', 'weichtiere', 'muschel', 'tintenfisch', 'krake', 'moluscos', 'mejillón', 'mexilhão', 'lula'],
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Un'etichetta che dichiara "senza glutine" contiene comunque la parola
// "glutine": cercarla e basta faceva dire all'app "Contiene: Glutine" su un
// prodotto gluten-free. Queste due forme coprono i modi normali di negare un
// allergene in etichetta ("senza X", "X free") e restano volutamente strette:
// qui un falso negativo è molto più grave di un falso positivo, quindi un
// match si scarta solo quando la negazione è inequivocabile.
const NEGATION_BEFORE = /\b(?:senza|sans|ohne|sin|sem|without)\s+(?:[a-zà-öø-ÿ]+\s+)?$/i
const FREE_AFTER = /^\s*[-–—]?\s*(?:free|frei|libre)\b/i

/**
 * True se l'occorrenza trovata a `index` è in realtà una dichiarazione di
 * assenza ("senza glutine", "gluten free") e non di presenza.
 */
export function isNegatedAllergenMatch(
  text: string,
  index: number,
  matchLength: number,
): boolean {
  const before = text.slice(Math.max(0, index - 24), index)
  const after = text.slice(index + matchLength)
  return NEGATION_BEFORE.test(before) || FREE_AFTER.test(after)
}

/** Regex delle parole chiave di un allergene, con boundary di parola. */
export function keywordPattern(words: string[], flags = 'gi'): RegExp {
  return new RegExp(`\\b(${words.map(escapeRegExp).join('|')})\\b`, flags)
}

/**
 * Cerca nel testo ingredienti le parole chiave di ciascun allergene del
 * profilo. Fallback quando `allergens_tags` non basta (vedi sopra).
 * Boundary di parola espliciti: qui il risultato alimenta un giudizio
 * "pericoloso", non solo una colorazione, quindi serve più precisione del
 * semplice `includes` usato per l'highlight visivo.
 */
export function matchAllergensInText(
  text: string | undefined,
  profileAllergens: string[],
): string[] {
  if (!text) return []
  return profileAllergens.filter((tag) => {
    const words = ALLERGEN_KEYWORDS[tag]
    if (!words || words.length === 0) return false
    const re = keywordPattern(words)
    // Basta una sola occorrenza non negata per considerare l'allergene presente.
    for (let m = re.exec(text); m !== null; m = re.exec(text)) {
      if (!isNegatedAllergenMatch(text, m.index, m[0].length)) return true
    }
    return false
  })
}

/** Concatena i campi testo ingredienti disponibili (IT/EN/originale) in
 * un'unica stringa per il matching: il dizionario keyword copre già IT+EN,
 * quindi non serve scegliere un solo campo lingua. */
export function getIngredientsRawText(
  product: Pick<Product, 'ingredients_text' | 'ingredients_text_it' | 'ingredients_text_en'>,
): string | undefined {
  const parts = [product.ingredients_text, product.ingredients_text_it, product.ingredients_text_en]
    .map((s) => s?.trim())
    .filter((s): s is string => !!s)
  return parts.length > 0 ? parts.join(' \n ') : undefined
}

export interface AllergenCheckResult {
  /** allergeni del profilo rilevati (via tag OFF o testo ingredienti) */
  detected: string[]
  /** possibili tracce ("può contenere"), solo da tag OFF, esclusi quelli già in `detected` */
  traces: string[]
  /** false se non c'è alcun segnale (né tag né testo) per esprimere un verdetto */
  hasData: boolean
}

function computeAllergenCheck(
  allergensTags: string[] | undefined,
  tracesTags: string[] | undefined,
  ingredientsText: string | undefined,
  profileAllergens: string[],
): AllergenCheckResult {
  const fromTags = matchAllergens(allergensTags, profileAllergens)
  const fromText = matchAllergensInText(ingredientsText, profileAllergens)
  const detected = Array.from(new Set([...fromTags, ...fromText]))
  const traces = matchAllergens(tracesTags, profileAllergens).filter(
    (tag) => !detected.includes(tag),
  )
  const hasData = (allergensTags?.length ?? 0) > 0 || !!ingredientsText
  return { detected, traces, hasData }
}

/**
 * Verdetto allergeni completo per un prodotto: combina i tag OFF
 * (`allergens_tags`/`traces_tags`) con un fallback testuale sugli
 * ingredienti, e distingue "nessun allergene rilevato" da "dati
 * insufficienti per stabilirlo" (`hasData: false`).
 */
export function checkAllergens(
  product: Product,
  profileAllergens: string[],
): AllergenCheckResult {
  return computeAllergenCheck(
    product.allergens_tags,
    product.traces_tags,
    getIngredientsRawText(product),
    profileAllergens,
  )
}

/**
 * Stessa logica di `checkAllergens`, ma per una voce di storico
 * (dataset ridotto salvato in `as_history`, vedi `useScanHistory`) invece
 * del `Product` completo. Le entry salvate prima dell'introduzione dei
 * campi `tracesTags`/`ingredientsText` li avranno `undefined`: si degrada
 * correttamente al solo confronto sui tag, senza errori.
 */
export function checkAllergensFromHistoryEntry(
  entry: HistoryEntry,
  profileAllergens: string[],
): AllergenCheckResult {
  return computeAllergenCheck(
    entry.allergensTags,
    entry.tracesTags,
    entry.ingredientsText,
    profileAllergens,
  )
}
