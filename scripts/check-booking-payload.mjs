// Payload-contract check for the real Service OS booking form.
//
// Compiles src/booking.ts on its own and verifies that the payload builder
// produces exactly the fields the Service OS guest intake accepts
// (POST /api/v1/speedy/book, guestBookingSchema in the flagship API):
// required fields present with the right names/types, attribution passed
// through only when present, and invalid fills blocked client-side.
// It never sends anything anywhere.
//
// Run from the repo root after `npm install`:  node scripts/check-booking-payload.mjs

import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const outDir = mkdtempSync(join(tmpdir(), 'thar-booking-check-'))
execFileSync(
  process.execPath,
  [join('node_modules', 'typescript', 'bin', 'tsc'), 'src/booking.ts', '--module', 'esnext', '--target', 'es2020', '--moduleResolution', 'bundler', '--skipLibCheck', '--outDir', outDir],
  { stdio: 'inherit' },
)
const { buildBookingPayload, captureAttribution, validateBookingForm } = await import(
  pathToFileURL(join(outDir, 'booking.js')).href
)

let failures = 0
const check = (label, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`)
  if (!cond) failures += 1
}

const form = {
  name: 'Maria Lopez',
  phone: '954-555-0134',
  city: 'Weston',
  zip: '33326',
  service: 'Refrigerator Repair',
  appliance: 'Samsung French-door fridge',
  window: 'Morning',
  problem: 'Fridge is warm and the compressor clicks every few minutes.',
}
const attribution = captureAttribution(
  '?utm_source=google&utm_medium=cpc&utm_campaign=broward_search&gclid=abc123&fbclid=fb9&msclkid=ms7',
)
const payload = buildBookingPayload(form, attribution, 'https://totalhomeappliancerepair.com/')

check('valid fill builds a payload', payload !== null)
check(
  'payload keys are exactly the contract fields',
  JSON.stringify(Object.keys(payload).sort()) ===
    JSON.stringify(['appliance', 'city', 'customer', 'fbclid', 'gclid', 'issue', 'msclkid', 'page', 'preferredWindow', 'source', 'utmCampaign', 'utmMedium', 'utmSource', 'via', 'zip'].sort()),
)
check('customer carries exactly name + phone', JSON.stringify(Object.keys(payload.customer).sort()) === JSON.stringify(['name', 'phone']))
check('customer.name is a string ≥ 2 chars', typeof payload.customer.name === 'string' && payload.customer.name.length >= 2)
check('customer.phone is a string ≥ 7 chars', typeof payload.customer.phone === 'string' && payload.customer.phone.length >= 7)
check('city is a string ≥ 2 chars', typeof payload.city === 'string' && payload.city.length >= 2)
check('zip matches /^\\d{5}$/', typeof payload.zip === 'string' && /^\d{5}$/.test(payload.zip))
check('appliance is the selected service', payload.appliance === 'Refrigerator Repair')
check('issue carries the problem + brand/model note', payload.issue === `${form.problem} (Appliance: ${form.appliance})`)
check('issue is a string ≥ 3 chars', typeof payload.issue === 'string' && payload.issue.length >= 3)
check('preferredWindow passes through', payload.preferredWindow === 'Morning')
check("source is 'WEB_FORM' (the classic form, not Speedy chat)", payload.source === 'WEB_FORM')
check('via names this site', payload.via === 'totalhomeappliancerepair.com')
check('utm fields pass through (camelCase contract names)', payload.utmSource === 'google' && payload.utmMedium === 'cpc' && payload.utmCampaign === 'broward_search')
check('click IDs pass through', payload.gclid === 'abc123' && payload.fbclid === 'fb9' && payload.msclkid === 'ms7')

const bare = buildBookingPayload(form, captureAttribution(''), undefined)
check('no attribution in URL → no attribution keys in payload', bare !== null && !('utmSource' in bare) && !('gclid' in bare) && !('page' in bare))
check('empty query string captures nothing', JSON.stringify(captureAttribution('')) === '{}')

for (const [label, patch] of [
  ['missing ZIP', { zip: '' }],
  ['4-digit ZIP', { zip: '3332' }],
  ['missing city', { city: '' }],
  ['missing service', { service: '' }],
  ['too-short phone', { phone: '555' }],
  ['too-short problem', { problem: 'no' }],
  ['missing name', { name: '' }],
]) {
  const bad = { ...form, ...patch }
  check(`${label} is blocked client-side`, validateBookingForm(bad) !== null && buildBookingPayload(bad, {}) === null)
}
check('the valid fill passes validation', validateBookingForm(form) === null)

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
