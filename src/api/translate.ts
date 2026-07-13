import type { Lang } from '../i18n/translations'

/**
 * Traduzione del testo ingredienti via MyMemory (gratuita, senza API key).
 * Stesso pattern di cache di openFoodFacts.ts: memoria + localStorage con TTL.
 * Ogni fallimento (offline, quota giornaliera, timeout) degrada in silenzio
 * al testo originale: la traduzione è un miglioramento, mai un requisito.
 */

const BASE = 'https://api.mymemory.translated.net/get'
const TIMEOUT_MS = 8_000
// le traduzioni non cambiano: TTL lungo
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000
const CACHE_PREFIX = 'as_ingredients_tr_v1:'
// margine sotto il limite ~500 caratteri per richiesta del piano anonimo
const CHUNK_SIZE = 450

const memoryCache = new Map<string, string>()

export interface TranslateResult {
  text: string
  /** false: fallback al testo originale (traduzione non riuscita) */
  translated: boolean
}

function cacheKey(code: string, targetLang: Lang): string {
  return `${CACHE_PREFIX}${targetLang}:${code}`
}

function readStoredCache(key: string): string | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { at, text } = JSON.parse(raw) as { at: number; text: string }
    if (Date.now() - at > CACHE_TTL_MS) {
      localStorage.removeItem(key)
      return null
    }
    return text
  } catch {
    return null
  }
}

function writeStoredCache(key: string, text: string) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), text }))
  } catch {
    // storage pieno: la cache in memoria basta
  }
}

/**
 * Traduce il testo ingredienti nella lingua target, con cache per
 * barcode+lingua e fallback silenzioso al testo originale.
 */
export async function translateIngredients(
  code: string,
  text: string,
  targetLang: Lang,
): Promise<TranslateResult> {
  const key = cacheKey(code, targetLang)
  const cached = memoryCache.get(key) ?? readStoredCache(key)
  if (cached) {
    memoryCache.set(key, cached)
    return { text: cached, translated: true }
  }

  if (!navigator.onLine) return { text, translated: false }

  try {
    const chunks = chunkText(text, CHUNK_SIZE)
    const translatedChunks: string[] = []
    // in sequenza, non in parallelo: più gentile con il rate limit anonimo
    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, targetLang))
    }
    const result = translatedChunks.join(' ')
    memoryCache.set(key, result)
    writeStoredCache(key, result)
    return { text: result, translated: true }
  } catch {
    // MyMemory non disponibile o quota esaurita: si mostra l'originale
    return { text, translated: false }
  }
}

/** Spezza il testo in blocchi sotto `size` caratteri, su virgole/punti. */
function chunkText(text: string, size: number): string[] {
  if (text.length <= size) return [text]
  const parts = text.split(/(?<=[,.;])\s+/)
  const chunks: string[] = []
  let current = ''
  for (const part of parts) {
    if (current && (current + ' ' + part).length > size) {
      chunks.push(current)
      current = part
    } else {
      current = current ? `${current} ${part}` : part
    }
  }
  if (current) chunks.push(current)
  // una singola "parte" oltre il limite (testo senza punteggiatura): tronca
  return chunks.map((c) => (c.length > size ? c.slice(0, size) : c))
}

async function translateChunk(chunk: string, targetLang: Lang): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const params = new URLSearchParams({
      q: chunk,
      // "autodetect" come sorgente è supportato (verificato con l'API live);
      // la forma con sorgente vuota "|it" viene invece rifiutata
      langpair: `autodetect|${targetLang}`,
    })
    const res = await fetch(`${BASE}?${params}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`MyMemory ${res.status}`)
    const data = (await res.json()) as {
      responseStatus?: number
      quotaFinished?: boolean | null
      responseData?: { translatedText?: string }
    }
    const translated = data.responseData?.translatedText
    if (
      data.responseStatus !== 200 ||
      data.quotaFinished === true ||
      !translated ||
      translated.startsWith('MYMEMORY WARNING')
    ) {
      throw new Error('MyMemory bad response')
    }
    return translated
  } finally {
    clearTimeout(timer)
  }
}
