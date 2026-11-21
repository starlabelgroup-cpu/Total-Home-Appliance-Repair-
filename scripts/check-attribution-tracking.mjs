// Conversion-tracking drill (2026-11-20): proves the THAR site's
// first-touch attribution + Google Ads tag slot without a browser.
//   1. captureAttribution reads utm_term / utm_content alongside the
//      click IDs.
//   2. buildBookingPayload carries them into the intake payload.
//   3. firstTouchAttribution: the first tagged visit inside the
//      30-day window wins; an expired touch is replaced.
//   4. The Google Ads slot is INERT while src/adsConfig.ts is unset
//      (no send_to, conversion fire is a no-op) and fires with the
//      exact send_to + booking reference once configured.
// Run: node scripts/check-attribution-tracking.mjs
import ts from 'typescript'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = mkdtempSync(join(tmpdir(), 'tha-attr-'))

function compile(name) {
  const src = readFileSync(join(root, 'src', `${name}.ts`), 'utf8')
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const file = join(tmp, `${name}.mjs`)
  writeFileSync(file, out.replace(/from\s+(['"])\.\/adsConfig\1/, 'from "./adsConfig.mjs"'))
  return pathToFileURL(file).href
}

// localStorage stub (the module reads it lazily, per call).
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}

compile('adsConfig')
const booking = await import(compile('booking'))
const ads = await import(compile('googleAds'))

let pass = 0
let fail = 0
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) { pass++; console.log(`PASS  ${name}`) }
  else { fail++; console.log(`FAIL  ${name}  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`) }
}

/* 1 — capture reads the full parameter set */
const cap = booking.captureAttribution('?utm_source=google&utm_medium=cpc&utm_campaign=tha-search-launch&utm_term=fridge+repair&utm_content=ad-a&gclid=G-1&fbclid=F-1&msclkid=M-1')
check('capture utmTerm', cap.utmTerm, 'fridge repair')
check('capture utmContent', cap.utmContent, 'ad-a')
check('capture gclid', cap.gclid, 'G-1')
check('capture campaign', cap.utmCampaign, 'tha-search-launch')

/* 2 — the payload carries them to the intake */
const form = { name: 'Test Person', phone: '9545550111', city: 'Fort Lauderdale', zip: '33311', service: 'Refrigerator Repair', appliance: '', window: 'First available', problem: 'Fridge not cooling' }
const payload = booking.buildBookingPayload(form, cap, 'https://totalhomeappliance.com/')
check('payload utmTerm', payload?.utmTerm, 'fridge repair')
check('payload utmContent', payload?.utmContent, 'ad-a')
check('payload gclid', payload?.gclid, 'G-1')

/* 3 — first touch wins inside the window; expiry replaces */
const t0 = 1_700_000_000_000
const first = booking.firstTouchAttribution('?gclid=FIRST&utm_campaign=one', t0)
check('first touch stored', first.gclid, 'FIRST')
const second = booking.firstTouchAttribution('?gclid=SECOND&utm_campaign=two', t0 + 60_000)
check('first touch wins (gclid)', second.gclid, 'FIRST')
check('first touch wins (campaign)', second.utmCampaign, 'one')
const after = booking.firstTouchAttribution('?gclid=AFTER-EXPIRY', t0 + 31 * 24 * 60 * 60 * 1000)
check('expired touch replaced', after.gclid, 'AFTER-EXPIRY')

/* 4 — the tag slot: inert while unset, exact when configured */
check('default config yields no send_to', ads.googleAdsSendTo(), null)
check('id without label yields no send_to', ads.googleAdsSendTo({ id: 'AW-123456789', label: '' }), null)
check('init is inert while unset', ads.initGoogleAdsTag(), false)
check('conversion fire is a no-op while unset', ads.fireGoogleAdsConversion('TS-DRILL'), false)

const calls = []
globalThis.window = { gtag: (...args) => calls.push(args), dataLayer: [] }
const fired = ads.fireGoogleAdsConversion('TS-DRILL-REF', { id: 'AW-123456789', label: 'labelXYZ' })
check('conversion fires once configured', fired, true)
check('conversion event name', calls[0]?.[0] + ':' + calls[0]?.[1], 'event:conversion')
check('conversion send_to', calls[0]?.[2]?.send_to, 'AW-123456789/labelXYZ')
check('conversion transaction_id is the booking reference', calls[0]?.[2]?.transaction_id, 'TS-DRILL-REF')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
