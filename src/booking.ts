// ─── Real Service OS booking ────────────────────────────────────────────────
// This site's booking form submits to the SAME public intake the flagship
// Service OS booking form uses: POST /speedy/book on the Service OS API.
// The payload contract below mirrors apps/api/src/routes/speedy.js
// (guestBookingSchema) field for field:
//
//   customer.name   required, min 2 chars
//   customer.phone  required, min 7 chars (we require 7+ digits)
//   city            required, min 2 chars
//   zip             required, exactly 5 digits
//   appliance       required, min 2 chars
//   issue           required, min 3 chars
//   preferredWindow optional string
//   source          'WEB_FORM' for this classic form (Speedy chat bookings
//                   use 'SPEEDY_CHAT' — never claimed here)
//   attribution     page / via / utmSource / utmMedium / utmCampaign /
//                   gclid / fbclid / msclkid — all optional, additive
//
// The 201 response carries data.referenceCode — the booking reference the
// customer uses to track the job in Service OS. The response also carries
// areaStatus / areaMessage for out-of-area and area-review requests; those
// are surfaced to the customer verbatim, never hidden.

export const SERVICE_OS_API = 'https://top-speed-service-os.vercel.app/api/v1'
export const BOOKING_ENDPOINT = `${SERVICE_OS_API}/speedy/book`

export interface BookingFormState {
  name: string
  phone: string
  city: string
  zip: string
  service: string
  appliance: string
  window: string
  problem: string
}

export interface Attribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
}

/** Read the attribution parameters off a URL query string (first touch on
 *  the landing page). Returns only the keys that are actually present. */
export function captureAttribution(search: string): Attribution {
  const out: Attribution = {}
  try {
    const params = new URLSearchParams(search)
    const pick = (param: string, key: keyof Attribution) => {
      const v = params.get(param)
      if (v && v.trim()) out[key] = v.trim().slice(0, 200)
    }
    pick('utm_source', 'utmSource')
    pick('utm_medium', 'utmMedium')
    pick('utm_campaign', 'utmCampaign')
    pick('gclid', 'gclid')
    pick('fbclid', 'fbclid')
    pick('msclkid', 'msclkid')
  } catch {
    // An unparseable query string means no attribution — never an error.
  }
  return out
}

/** Client-side mirror of the intake contract. Returns the first problem
 *  found, or null when the form is submittable. */
export function validateBookingForm(form: BookingFormState): string | null {
  if (form.name.trim().length < 2) return 'Please add your name so the setter knows who to ask for.'
  if (form.phone.replace(/\D/g, '').length < 7) return 'Please add a phone number — your confirmation and updates go there.'
  if (!form.city) return 'Please choose your city.'
  if (!/^\d{5}$/.test(form.zip.trim())) return 'Please add the 5-digit ZIP code for the visit.'
  if (!form.service) return 'Please choose the service you need.'
  if (form.problem.trim().length < 3) return 'A sentence about the problem helps the tech bring the right parts.'
  return null
}

/** Build the exact intake payload, or null when the form is invalid.
 *  The brand/model the customer typed rides inside the issue text (the
 *  same pattern the flagship form uses for its note field), so the
 *  appliance field stays the service the setter dispatches against. */
export function buildBookingPayload(
  form: BookingFormState,
  attribution: Attribution,
  page?: string,
): Record<string, unknown> | null {
  if (validateBookingForm(form)) return null
  const issue = form.appliance.trim()
    ? `${form.problem.trim()} (Appliance: ${form.appliance.trim()})`
    : form.problem.trim()
  const payload: Record<string, unknown> = {
    customer: { name: form.name.trim(), phone: form.phone.trim() },
    city: form.city.trim(),
    zip: form.zip.trim(),
    appliance: form.service.trim(),
    issue,
    preferredWindow: form.window,
    source: 'WEB_FORM',
    via: 'totalhomeappliancerepair.com',
  }
  if (page) payload.page = page.slice(0, 1000)
  if (attribution.utmSource) payload.utmSource = attribution.utmSource
  if (attribution.utmMedium) payload.utmMedium = attribution.utmMedium
  if (attribution.utmCampaign) payload.utmCampaign = attribution.utmCampaign
  if (attribution.gclid) payload.gclid = attribution.gclid
  if (attribution.fbclid) payload.fbclid = attribution.fbclid
  if (attribution.msclkid) payload.msclkid = attribution.msclkid
  return payload
}

export interface BookingResult {
  referenceCode: string
  status: string
  city: string
  area: string | null
  areaStatus: string
  appliance: string
  preferredWindow: string | null
  areaMessage?: string
}

/** POST the payload to the real intake. Resolves with the booking result
 *  on 201; throws an Error with customer-safe copy on any failure. */
export async function submitBooking(payload: Record<string, unknown>): Promise<BookingResult> {
  let res: Response
  try {
    res = await fetch(BOOKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Your request did not go through — nothing was submitted.')
  }
  const body = (await res.json().catch(() => null)) as { data?: BookingResult; error?: string } | null
  if (!res.ok || !body?.data?.referenceCode) {
    throw new Error(body?.error || 'Your request did not go through — nothing was submitted.')
  }
  // GA4 conversion event: Service OS accepted the booking and issued a
  // reference code. Guarded — a silent no-op when no Google tag is
  // installed on the page.
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'booking_submitted', {
      reference_code: body.data.referenceCode,
      via: payload.via,
    })
  }
  return body.data
}
