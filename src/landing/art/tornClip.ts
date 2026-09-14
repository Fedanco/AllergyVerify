/** Generatore pseudo-casuale con seme: lo stesso seme dà sempre lo stesso strappo. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Poligono `clip-path` con i quattro bordi strappati. Gli scostamenti sono in
 * pixel (`amp`), non in percentuale: un 2% su un cartellino largo e basso
 * darebbe denti lunghi in orizzontale e piatti in verticale.
 */
export function tornClip(seed: number, amp = 6, teeth = 12): string {
  const rnd = mulberry32(seed)
  const j = () => (rnd() * amp).toFixed(1)
  const pct = (i: number) => ((i / teeth) * 100).toFixed(2)
  const pts: string[] = []
  for (let i = 0; i <= teeth; i++) pts.push(`${pct(i)}% ${j()}px`)
  for (let i = 1; i <= teeth; i++) pts.push(`calc(100% - ${j()}px) ${pct(i)}%`)
  for (let i = teeth - 1; i >= 0; i--) pts.push(`${pct(i)}% calc(100% - ${j()}px)`)
  for (let i = teeth - 1; i >= 1; i--) pts.push(`${j()}px ${pct(i)}%`)
  return `polygon(${pts.join(', ')})`
}

/**
 * Foglio a tutta larghezza: strappo solo sopra e sotto (i lati coincidono con
 * i bordi della pagina), denti più larghi perché il foglio è largo quanto lo
 * schermo.
 */
export function sheetClip(seed: number, amp = 14, teeth = 40): string {
  const rnd = mulberry32(seed)
  const j = () => (rnd() * amp).toFixed(1)
  const pct = (i: number) => ((i / teeth) * 100).toFixed(2)
  const pts: string[] = []
  for (let i = 0; i <= teeth; i++) pts.push(`${pct(i)}% ${j()}px`)
  for (let i = teeth; i >= 0; i--) pts.push(`${pct(i)}% calc(100% - ${j()}px)`)
  return `polygon(${pts.join(', ')})`
}
