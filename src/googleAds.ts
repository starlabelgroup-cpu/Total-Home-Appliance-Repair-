/* Google Ads conversion tag wiring (conversion tracking, 2026-11-20).
   Config-driven from src/adsConfig.ts — the single paste point. While
   the ID/label are unset there, every function here is an inert no-op:
   no script loads and nothing fires. When they are set, the booking
   success path fires the Ads conversion with the booking reference as
   the transaction ID (the same reference the Service OS stores, so a
   click, a booking, and a conversion always reconcile). */

import { GOOGLE_ADS_CONVERSION_ID, GOOGLE_ADS_CONVERSION_LABEL } from './adsConfig'

export interface GoogleAdsConfig {
  id: string
  label: string
}

export const GOOGLE_ADS_CONFIG: GoogleAdsConfig = {
  id: GOOGLE_ADS_CONVERSION_ID,
  label: GOOGLE_ADS_CONVERSION_LABEL,
}

/** The gtag `send_to` value ("AW-…/label"), or null when the tag slot
 *  is unset — the inert state. Both halves are required: an ID without
 *  its label cannot address a conversion action. */
export function googleAdsSendTo(cfg: GoogleAdsConfig = GOOGLE_ADS_CONFIG): string | null {
  const id = (cfg.id || '').trim()
  const label = (cfg.label || '').trim()
  return id && label ? `${id}/${label}` : null
}

/** Load the Google tag for the Ads conversion ID. No-op (returns
 *  false) while the slot is unset, and a no-op when a gtag is already
 *  on the page (the GA4 tag installed in index.html provides one — it
 *  can carry Ads conversions via its linked accounts, and loading a
 *  second copy would double-count). */
export function initGoogleAdsTag(cfg: GoogleAdsConfig = GOOGLE_ADS_CONFIG): boolean {
  const sendTo = googleAdsSendTo(cfg)
  if (!sendTo) return false
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  const w = window as any
  if (typeof w.gtag === 'function') return true
  const id = (cfg.id || '').trim()
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  w.gtag('js', new Date())
  w.gtag('config', id)
  return true
}

/** Fire the booking conversion. Returns false (and sends nothing)
 *  while the slot is unset. The transaction ID is the Service OS
 *  booking reference — Google deduplicates on it, so a re-fire can
 *  never double-count a booking. */
export function fireGoogleAdsConversion(
  referenceCode: string,
  cfg: GoogleAdsConfig = GOOGLE_ADS_CONFIG,
): boolean {
  const sendTo = googleAdsSendTo(cfg)
  if (!sendTo) return false
  if (typeof window === 'undefined') return false
  const w = window as any
  if (typeof w.gtag !== 'function' && !initGoogleAdsTag(cfg)) return false
  if (typeof w.gtag !== 'function') return false
  w.gtag('event', 'conversion', { send_to: sendTo, transaction_id: referenceCode || '' })
  return true
}
