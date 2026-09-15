/**
 * Rigenera gli screenshot del README (docs/screenshots/*.webp) con il Chrome
 * di sistema guidato da playwright-core, come nella skill di verifica.
 *
 * Prerequisiti, dalla root del progetto:
 *   npm run build
 *   npm run preview -- --port 4173      (in un altro terminale)
 *   npm install --no-save playwright-core
 *   python -m pip install pillow        (una volta sola; serve anche a hero-webp.py)
 *   node scripts/readme-screenshots.mjs
 *
 * Serve la rete: i dati arrivano da Open Food Facts, a volte lento: ogni
 * scatto viene ritentato una volta. I PNG a doppia risoluzione pesano ~1 MB
 * l'uno per via della grana della carta; in WebP (qualità 88, a occhio
 * identico) pesano un decimo, quindi i PNG restano in una cartella
 * temporanea e nel repo vanno solo i WebP.
 */
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const BASE = 'http://localhost:4173'
const OUT = 'docs/screenshots'
const BARCODE = '3017620425035' // Nutella (FR): contiene latte, senza glutine
const PHONE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 800 }
const TIMEOUT = 45000

/** Stato dell'app: lingua italiana e due profili attivi, così il verdetto
 *  mostra una riga per persona (CONTIENE per Io, OK per Ospite). */
const SEED = {
  as_lang: 'it',
  as_profiles: [
    { id: 'p1', name: 'Io', allergens: ['milk'] },
    { id: 'p2', name: 'Ospite', allergens: ['gluten'] },
  ],
  as_active_profiles: ['p1', 'p2'],
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  // Le animazioni d'ingresso (banner-in, slap, step-in) durano meno di 1 s.
  await page.waitForTimeout(1500)
}

/** Aspetta le immagini nella viewport: quelle sotto la piega sono
 *  `loading="lazy"` e non partono finché non si scorre. */
async function waitImages(page) {
  await page.waitForFunction(
    () =>
      [...document.images]
        .filter((img) => img.getBoundingClientRect().top < window.innerHeight)
        .every((img) => img.complete && img.naturalWidth > 0),
    null,
    { timeout: TIMEOUT },
  )
}

async function shoot(browser, tmp, name, viewport, scale, run) {
  for (let attempt = 1; ; attempt++) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, locale: 'it-IT' })
    await ctx.addInitScript((seed) => {
      for (const [k, v] of Object.entries(seed)) {
        localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v))
      }
    }, SEED)
    try {
      const page = await ctx.newPage()
      await run(page)
      await settle(page)
      await page.screenshot({ path: join(tmp, `${name}.png`) })
      console.log(`✓ ${name} (${viewport.width}×${viewport.height} @${scale}x)`)
      return
    } catch (err) {
      if (attempt >= 2) throw err
      console.warn(`  ! ${name}: ${err.message.split('\n')[0]} — riprovo`)
    } finally {
      await ctx.close()
    }
  }
}

const openProduct = async (page) => {
  await page.goto(`${BASE}/app/#/product/${BARCODE}`)
  await page.waitForSelector('h1.font-hand', { timeout: TIMEOUT })
  await waitImages(page)
}

const tmp = await mkdtemp(join(tmpdir(), 'allergyverify-shots-'))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  await shoot(browser, tmp, 'product-detail', PHONE, 2, openProduct)

  await shoot(browser, tmp, 'search', PHONE, 2, async (page) => {
    await page.goto(`${BASE}/app/#/`)
    await page.fill('input[type="text"]', 'nutella')
    await page.click('button[type="submit"]')
    await page.waitForSelector('ul a.card', { timeout: TIMEOUT })
    await waitImages(page)
  })

  await shoot(browser, tmp, 'desktop', DESKTOP, 1, openProduct)

  await shoot(browser, tmp, 'landing', DESKTOP, 1, async (page) => {
    await page.goto(`${BASE}/`)
    await page.waitForSelector('h1', { timeout: TIMEOUT })
    await waitImages(page)
  })
  // PNG → WebP con Pillow, nella cartella del repo.
  const convert = `
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
for name in ('product-detail', 'search', 'desktop', 'landing'):
    Image.open(f'{src}/{name}.png').convert('RGB').save(f'{out}/{name}.webp', quality=88, method=6)
    print(f'  -> {out}/{name}.webp')
`
  execFileSync('python', ['-c', convert, tmp, OUT], { stdio: 'inherit' })
} finally {
  await browser.close()
  await rm(tmp, { recursive: true, force: true })
}
