import { useEffect, useMemo, useState } from 'react'
import {
  CITIES, NETWORK_STATS, TRACKING_STAGES, EMAIL, PHONE_DISPLAY, PHONE_SMS, PHONE_TEL,
  SERVICES, SERVICE_OS_URL, SERVICE_OS_BOOK_URL, SERVICE_OS_SPEEDY_URL, SERVICE_OS_TRACK_URL,
  SERVICE_OS_SIGNIN_URL, SERVICE_OS_RESET_URL,
  SISTER_BRANDS, GUIDE_APPLIANCES, GUIDE_RULES,
} from './data'
import {
  buildBookingPayload, captureAttribution, submitBooking, validateBookingForm,
  type BookingResult,
} from './booking'
import { Icon, Logo } from './icons'

type View =
  | { kind: 'hub' }
  | { kind: 'services' }
  | { kind: 'service'; id: string }
  | { kind: 'cities' }
  | { kind: 'city'; id: string }
  | { kind: 'book'; serviceId?: string; cityId?: string }
  | { kind: 'speedy' }
  | { kind: 'hq' }
  | { kind: 'track' }
  | { kind: 'about' }

const NAV: { kind: View['kind']; label: string }[] = [
  { kind: 'hub', label: 'Network Hub' },
  { kind: 'services', label: 'Services' },
  { kind: 'cities', label: 'City Pages' },
  { kind: 'speedy', label: 'Speedy' },
  { kind: 'track', label: 'Track a Job' },
  { kind: 'hq', label: 'Network HQ' },
  { kind: 'about', label: 'About' },
]

function serviceById(id?: string) {
  return SERVICES.find((s) => s.id === id) ?? null
}
function cityById(id?: string) {
  return CITIES.find((c) => c.id === id) ?? null
}

export default function App() {
  const [view, setView] = useState<View>({ kind: 'hub' })

  const go = (v: View) => setView(v)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [view])

  const navOn = (k: View['kind']) =>
    view.kind === k || (k === 'services' && view.kind === 'service') || (k === 'cities' && view.kind === 'city')

  return (
    <>
      <div className="topbar">
        <div className="topbar-in">
          <span className="tb-item"><Icon name="pin" size={14} /> Broward County, Florida — residential appliance repair network</span>
          <span className="tb-item">
            Call or text <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
            <span aria-hidden>·</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </span>
        </div>
      </div>

      <header className="site">
        <div className="header-in">
          <button className="brand" onClick={() => go({ kind: 'hub' })} aria-label="Total Home Appliance Repair — home">
            <Logo size={42} />
            <span>
              <span className="brand-name">Total Home<br />Appliance Repair</span>
              <span className="brand-sub" style={{ display: 'block' }}>A Top Speed Appliance Network</span>
            </span>
          </button>
          <nav className="main" aria-label="Main">
            {NAV.map((n) => (
              <button key={n.kind} className={navOn(n.kind) ? 'on' : ''} onClick={() => go({ kind: n.kind } as View)}>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="header-cta">
            <a className="btn btn-ghost btn-sm" href={SERVICE_OS_SIGNIN_URL} target="_blank" rel="noreferrer">Sign in</a>
            <a className="btn btn-ghost btn-sm" href={PHONE_TEL}><Icon name="phone" size={16} /> {PHONE_DISPLAY}</a>
            <button className="btn btn-orange btn-sm" onClick={() => go({ kind: 'book' })}>Book a Repair</button>
          </div>
        </div>
        <div className="mobile-nav" aria-label="Main mobile">
          {NAV.map((n) => (
            <button key={n.kind} className={navOn(n.kind) ? 'on' : ''} onClick={() => go({ kind: n.kind } as View)}>
              {n.label}
            </button>
          ))}
          <button onClick={() => go({ kind: 'book' })}>Book</button>
          <a href={SERVICE_OS_SIGNIN_URL} target="_blank" rel="noreferrer">Sign in</a>
        </div>
      </header>

      <main>
        {view.kind === 'hub' && <Hub go={go} />}
        {view.kind === 'services' && <Services go={go} />}
        {view.kind === 'service' && <ServiceDetail id={view.id} go={go} />}
        {view.kind === 'cities' && <Cities go={go} />}
        {view.kind === 'city' && <CityPage id={view.id} go={go} />}
        {view.kind === 'book' && <Book key={`${view.serviceId ?? ''}-${view.cityId ?? ''}`} serviceId={view.serviceId} cityId={view.cityId} go={go} />}
        {view.kind === 'speedy' && <Speedy go={go} />}
        {view.kind === 'hq' && <HQ go={go} />}
        {view.kind === 'track' && <Track go={go} />}
        {view.kind === 'about' && <About go={go} />}
      </main>

      <Footer go={go} />
    </>
  )
}

/* ─── Shared bits ─────────────────────────────────────────────── */

function CtaRow({ go, serviceId, cityId, light }: { go: (v: View) => void; serviceId?: string; cityId?: string; light?: boolean }) {
  return (
    <div className="hero-ctas">
      <a className="btn btn-orange" href={PHONE_TEL}><Icon name="phone" size={18} /> Call {PHONE_DISPLAY}</a>
      <a className={`btn ${light ? 'btn-ghost' : 'btn-outline'}`} href={PHONE_SMS}><Icon name="chat" size={18} /> Text us</a>
      <button className={`btn ${light ? 'btn-ghost' : 'btn-navy'}`} onClick={() => go({ kind: 'book', serviceId, cityId })}>
        <Icon name="calendar" size={18} /> Book through Service OS
      </button>
    </div>
  )
}

function RoutingDiagram() {
  return (
    <div className="diagram" role="img" aria-label="Lead routing: any network page routes to Service OS, where Service Setters confirm the job, then a technician is dispatched and the job is tracked.">
      <div className="d-node"><strong>Any network page</strong>Hub, a service page, or a city page — the customer starts wherever they land.</div>
      <div className="d-arrow">▼</div>
      <div className="d-node hl"><strong>Top Speed Service OS</strong>Every request is submitted in one system — no page keeps its own leads.</div>
      <div className="d-arrow">▼</div>
      <div className="d-node"><strong>Setters confirm → tech dispatched</strong>Human Service Setters confirm every job before dispatch, and the customer tracks it in Service OS.</div>
    </div>
  )
}

/* ─── 1. Network Hub ──────────────────────────────────────────── */

function Hub({ go }: { go: (v: View) => void }) {
  return (
    <>
      <div className="hero">
        <div className="wrap">
          <span className="pill pill-dark">The residential repair network of Top Speed Appliance</span>
          <h1 style={{ marginTop: '1rem' }}>Every appliance. Every home. <em>One network.</em></h1>
          <p className="lede">
            Total Home Appliance Repair is one master hub plus a fleet of service and city pages across Broward County —
            and every page routes its bookings to the same place: Top Speed Service OS, where human Service Setters
            confirm each job before a technician is dispatched.
          </p>
          <CtaRow go={go} light />
          <div className="hero-meta">
            <span><Icon name="shield" size={16} /> Confirmed by a human setter — never auto-dispatched</span>
            <span><Icon name="route" size={16} /> One routing system for the whole fleet</span>
            <span><Icon name="pin" size={16} /> 16 Broward city pages · 10 service pages</span>
          </div>
        </div>
      </div>

      <section className="block">
        <div className="wrap">
          <span className="kicker"><Icon name="grid" size={14} /> Repair services</span>
          <h2 className="sec-title">Ten services, ten dedicated pages</h2>
          <p className="sec-sub">Each service has its own page in the fleet — common problems, what the technician checks, and a booking path that lands in the same Service OS queue.</p>
          <div className="grid grid-5 mt-lg">
            {SERVICES.map((s) => (
              <button key={s.id} className="card" onClick={() => go({ kind: 'service', id: s.id })}>
                <span className="ic"><Icon name={s.icon} size={24} /></span>
                <h3>{s.name.replace(' Repair', '')}</h3>
                <p>{s.tagline}</p>
                <span className="go">View service page <Icon name="arrow" size={15} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="block tight" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <span className="kicker"><Icon name="route" size={14} /> How the network works</span>
          <h2 className="sec-title">One request path, from any page</h2>
          <div className="steps mt-lg">
            <div className="step"><span className="num">1</span><h3>You send a request</h3><p>From the hub, a service page or your city page — with the booking form on this site, or by call or text to {PHONE_DISPLAY}.</p></div>
            <div className="step"><span className="num">2</span><h3>A setter confirms it</h3><p>Your request is submitted in Top Speed Service OS, where a human Service Setter reviews and confirms the job.</p></div>
            <div className="step"><span className="num">3</span><h3>A technician is dispatched</h3><p>Only confirmed jobs go out. The technician arrives knowing the appliance, the problem and the city.</p></div>
            <div className="step"><span className="num">4</span><h3>You track it in Service OS</h3><p>Job status lives in Service OS and the Appliance Connect portal — one record, start to finish.</p></div>
          </div>
          <div className="mt-lg"><RoutingDiagram /></div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <span className="kicker"><Icon name="hub" size={14} /> Network structure</span>
          <h2 className="sec-title">Built like a network, not a brochure</h2>
          <p className="sec-sub">One hub holds the fleet together. Service pages answer “what’s broken,” city pages answer “near me,” and sister brands cover the jobs around the repair.</p>
          <div className="grid grid-3 mt-lg">
            <button className="card" onClick={() => go({ kind: 'services' })}>
              <span className="ic"><Icon name="wrench" size={24} /></span>
              <h3>10 service pages</h3>
              <p>Refrigerator through wine cooler — symptoms, checks and a preselected booking for each appliance.</p>
              <span className="go">Browse services <Icon name="arrow" size={15} /></span>
            </button>
            <button className="card" onClick={() => go({ kind: 'cities' })}>
              <span className="ic"><Icon name="pin" size={24} /></span>
              <h3>16 city pages</h3>
              <p>Every Broward city in the network gets the same full fleet — generated from one city × service table.</p>
              <span className="go">Browse city pages <Icon name="arrow" size={15} /></span>
            </button>
            <button className="card" onClick={() => go({ kind: 'hq' })}>
              <span className="ic"><Icon name="layers" size={24} /></span>
              <h3>6 sister brands</h3>
              <p>Service OS, Appliance Connect, Clean Out Vents, Appliance Express, Appliance Plus and Gateway Express.</p>
              <span className="go">See Network HQ <Icon name="arrow" size={15} /></span>
            </button>
          </div>
          <div className="notice notice-info mt-lg">
            <Icon name="shield" size={20} />
            <p><strong>Straight talk on pricing:</strong> this site lists no prices. Your price is confirmed when you book through Service OS, before any work starts — nothing is dispatched or charged from a web form alone.</p>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── 2. Services ─────────────────────────────────────────────── */

function Services({ go }: { go: (v: View) => void }) {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Repair services</h1>
          <p>Every service below is its own page in the network fleet. Open one for the problems we see most, what the technician checks, and a booking with that service already selected.</p>
        </div>
      </div>
      <section className="block">
        <div className="wrap">
          <div className="grid grid-3">
            {SERVICES.map((s) => (
              <button key={s.id} className="card" onClick={() => go({ kind: 'service', id: s.id })}>
                <span className="ic"><Icon name={s.icon} size={24} /></span>
                <h3>{s.name}</h3>
                <p>{s.tagline}</p>
                <p style={{ marginTop: '0.5rem' }}>{s.problems.length} common problems · {s.checks.length} technician checks</p>
                <span className="go">Open service page <Icon name="arrow" size={15} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ServiceDetail({ id, go }: { id: string; go: (v: View) => void }) {
  const s = serviceById(id)
  if (!s) return <Services go={go} />
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <p className="crumb"><button onClick={() => go({ kind: 'services' })}>Services</button> / {s.name}</p>
          <span className="pill pill-dark">Service page · Total Home Appliance Repair network</span>
          <h1 style={{ marginTop: '0.7rem' }}>{s.name}</h1>
          <p>{s.tagline} Available across all 16 Broward network cities, booked through Top Speed Service OS.</p>
          <div style={{ marginTop: '1.4rem' }}><CtaRow go={go} serviceId={s.id} light /></div>
        </div>
      </div>
      <section className="block">
        <div className="wrap split">
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icon name="alert" size={20} /> Common problems we’re called for</h3>
            <ul className="prob-list mt">
              {s.problems.map((p) => <li key={p}><Icon name="arrow" size={16} /> {p}</li>)}
            </ul>
          </div>
          <div className="card" style={{ cursor: 'default' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icon name="wrench" size={20} /> What the technician checks</h3>
            <ul className="checklist mt">
              {s.checks.map((c) => <li key={c}><Icon name="check" size={16} /> {c}</li>)}
            </ul>
          </div>
        </div>
        <div className="wrap">
          <div className="notice notice-warn mt-lg">
            <Icon name="speedy" size={20} />
            <p><strong>Not sure it’s the {s.name.replace(' Repair', '').toLowerCase()}?</strong> Ask Speedy, the network’s AI assistant at Service OS, for a first look at likely causes and safety notes — a first look is not a diagnosis; only a technician inspecting the appliance can diagnose it. And remember: pricing is confirmed when you book through Service OS.</p>
          </div>
          <div className="mt" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button className="btn btn-navy" onClick={() => go({ kind: 'speedy' })}><Icon name="speedy" size={17} /> Ask Speedy first</button>
            <button className="btn btn-orange" onClick={() => go({ kind: 'book', serviceId: s.id })}><Icon name="calendar" size={17} /> Book {s.name.replace(' Repair', '')} repair</button>
            <button className="btn btn-outline" onClick={() => go({ kind: 'cities' })}><Icon name="pin" size={17} /> Find your city page</button>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── 3. City pages ───────────────────────────────────────────── */

function Cities({ go }: { go: (v: View) => void }) {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>City pages — the local fleet</h1>
          <p>Sixteen Broward County cities, one page each, all generated from a single city × service table and all routing to the same Service OS setters. Four core cities anchor the network; twelve more extend it across Broward.</p>
        </div>
      </div>
      <section className="block">
        <div className="wrap">
          <h2 className="sec-title" style={{ fontSize: '1.3rem' }}>Core network cities</h2>
          <div className="grid grid-2 mt">
            {CITIES.filter((c) => c.core).map((c) => <CityCard key={c.id} id={c.id} go={go} />)}
          </div>
          <h2 className="sec-title mt-lg" style={{ fontSize: '1.3rem' }}>Wider Broward network</h2>
          <div className="grid grid-3 mt">
            {CITIES.filter((c) => !c.core).map((c) => <CityCard key={c.id} id={c.id} go={go} />)}
          </div>
        </div>
      </section>
    </>
  )
}

function CityCard({ id, go }: { id: string; go: (v: View) => void }) {
  const c = cityById(id)!
  return (
    <button className="card" onClick={() => go({ kind: 'city', id: c.id })}>
      <span className="ic"><Icon name="pin" size={24} /></span>
      <h3>{c.name} <span className={`pill ${c.core ? 'pill-core' : 'pill-net'}`} style={{ marginLeft: '0.4rem' }}>{c.core ? 'Core city' : 'Network city'}</span></h3>
      <p>{c.blurb}</p>
      <span className="go">Open the {c.name} page <Icon name="arrow" size={15} /></span>
    </button>
  )
}

function CityPage({ id, go }: { id: string; go: (v: View) => void }) {
  const c = cityById(id)
  if (!c) return <Cities go={go} />
  const siblings = CITIES.filter((x) => x.id !== c.id)
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <p className="crumb"><button onClick={() => go({ kind: 'cities' })}>City Pages</button> / {c.name}</p>
          <span className={`pill ${c.core ? 'pill-core' : 'pill-dark'}`}>{c.core ? 'Core network city' : 'Broward network city'}</span>
          <h1 style={{ marginTop: '0.7rem' }}>Appliance Repair in {c.name}</h1>
          <p>{c.blurb} Bookings from this page are submitted through Top Speed Service OS and confirmed by a Service Setter before dispatch — the same as every page in the fleet.</p>
          <div style={{ marginTop: '1.4rem' }}><CtaRow go={go} cityId={c.id} light /></div>
        </div>
      </div>
      <section className="block">
        <div className="wrap">
          <span className="kicker"><Icon name="grid" size={14} /> Services in {c.name}</span>
          <h2 className="sec-title">All ten services, available in {c.name}</h2>
          <div className="grid grid-5 mt-lg">
            {SERVICES.map((s) => (
              <button key={s.id} className="card" onClick={() => go({ kind: 'service', id: s.id })}>
                <span className="ic"><Icon name={s.icon} size={24} /></span>
                <h3>{s.name.replace(' Repair', '')}</h3>
                <p>{s.tagline}</p>
                <span className="go">View & book <Icon name="arrow" size={15} /></span>
              </button>
            ))}
          </div>

          <h2 className="sec-title mt-lg" style={{ fontSize: '1.3rem' }}>Other city pages in the fleet</h2>
          <div className="chips mt">
            {siblings.map((x) => (
              <button key={x.id} className="chip" onClick={() => go({ kind: 'city', id: x.id })}>{x.name}</button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── 4. Book ─────────────────────────────────────────────────── */

type BookPhase =
  | { kind: 'form' }
  | { kind: 'sending' }
  | { kind: 'done'; result: BookingResult }
  | { kind: 'error'; message: string }

function Book({ serviceId, cityId, go }: { serviceId?: string; cityId?: string; go: (v: View) => void }) {
  const svc = serviceById(serviceId)
  const cty = cityById(cityId)
  const [form, setForm] = useState({
    name: '', phone: '',
    city: cty?.name ?? '',
    zip: '',
    service: svc?.name ?? '',
    appliance: '', problem: '', window: 'First available',
  })
  const [phase, setPhase] = useState<BookPhase>({ kind: 'form' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase.kind === 'sending') return
    const problem = validateBookingForm(form)
    if (problem) {
      setPhase({ kind: 'error', message: problem })
      return
    }
    const payload = buildBookingPayload(
      form,
      captureAttribution(window.location.search),
      window.location.href.split('#')[0],
    )
    if (!payload) {
      setPhase({ kind: 'error', message: 'Please check the form and try again.' })
      return
    }
    setPhase({ kind: 'sending' })
    try {
      const result = await submitBooking(payload)
      setPhase({ kind: 'done', result })
    } catch (err) {
      setPhase({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Your request did not go through — nothing was submitted.',
      })
    }
  }

  const result = phase.kind === 'done' ? phase.result : null
  const outOfArea = result?.areaStatus === 'OUT_OF_AREA'

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>Book a repair</h1>
          <p>Send your request right here — it goes straight into Top Speed Service OS, the system the Service Setters work from. A setter confirms every job before a technician is dispatched.</p>
        </div>
      </div>
      <section className="block">
        <div className="wrap split">
          {result ? (
            <div className="form-card">
              <span className={`pill ${outOfArea ? 'pill-demo' : 'pill-live'}`}>{outOfArea ? 'Request saved' : 'Booking received'}</span>
              <h2 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginTop: '0.7rem' }}>
                {outOfArea ? 'That address is outside our current service area' : 'Booking received — thank you'}
              </h2>
              {result.areaMessage ? (
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: '0.4rem 0 1rem' }}>{result.areaMessage}</p>
              ) : (
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: '0.4rem 0 1rem' }}>
                  Your {result.appliance} request in {result.city} is in the Service OS queue. A Service Setter will call
                  the number you gave to confirm the job, the window and the pricing before dispatch — nothing is
                  dispatched or charged from a web form alone.
                </p>
              )}
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>{outOfArea ? 'Your reference:' : 'Your booking reference:'}</p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: 'var(--navy)', margin: '0.2rem 0 1rem' }}>{result.referenceCode}</p>
              <ul className="checklist">
                <li><Icon name="check" size={16} /> <span>Keep the reference — with your phone number, it opens live tracking in Service OS.</span></li>
                <li><Icon name="phone" size={16} /> <span>Watch for the setter’s call to confirm your {result.preferredWindow ? result.preferredWindow.toLowerCase() : 'preferred'} window.</span></li>
              </ul>
              <div className="mt" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a className="btn btn-orange" href={SERVICE_OS_TRACK_URL} target="_blank" rel="noreferrer"><Icon name="track" size={16} /> Track your job in Service OS</a>
                <a className="btn btn-outline" href={PHONE_TEL}><Icon name="phone" size={16} /> {PHONE_DISPLAY}</a>
                <button className="btn btn-outline" type="button" onClick={() => setPhase({ kind: 'form' })}>Book another repair</button>
              </div>
            </div>
          ) : (
            <form className="form-card" onSubmit={onSubmit}>
              <h2 style={{ color: 'var(--navy)', fontSize: '1.2rem' }}>Booking form</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', margin: '0.3rem 0 1.1rem' }}>
                This form submits your real request to Top Speed Service OS. When it goes through, your booking
                reference appears right here — that’s your proof it landed with the setters.
              </p>
              <div className="form-grid">
                <label className="f">Your name<input required value={form.name} onChange={set('name')} placeholder="Full name" /></label>
                <label className="f">Phone (call/text)<input required value={form.phone} onChange={set('phone')} placeholder="Best number for the setter" /></label>
                <label className="f">City
                  <select required value={form.city} onChange={set('city')}>
                    <option value="">Select your city…</option>
                    {CITIES.map((c) => <option key={c.id} value={c.name}>{c.name}{c.core ? ' (core)' : ''}</option>)}
                  </select>
                </label>
                <label className="f">ZIP code<input required value={form.zip} onChange={set('zip')} placeholder="5-digit ZIP" inputMode="numeric" maxLength={5} /></label>
                <label className="f">Service
                  <select required value={form.service} onChange={set('service')}>
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </label>
                <label className="f">Appliance (brand / model if known)<input value={form.appliance} onChange={set('appliance')} placeholder="e.g. Samsung French-door fridge" /></label>
                <label className="f">Preferred window
                  <select value={form.window} onChange={set('window')}>
                    <option>First available</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </label>
                <label className="f full">What’s the problem?<textarea required rows={4} value={form.problem} onChange={set('problem')} placeholder="Describe the symptom — noises, leaks, error codes, when it started…" /></label>
              </div>
              {phase.kind === 'error' && (
                <div className="notice notice-warn mt">
                  <Icon name="alert" size={20} />
                  <p><strong>{phase.message}</strong> You can also book with Speedy below, or call or text {PHONE_DISPLAY} and a setter will book you in.</p>
                </div>
              )}
              <button className="btn btn-orange mt" type="submit" disabled={phase.kind === 'sending'}>
                <Icon name="calendar" size={17} /> {phase.kind === 'sending' ? 'Sending to Service OS…' : 'Submit my booking request'}
              </button>
            </form>
          )}

          <div className="stack">
            <div className="card" style={{ cursor: 'default' }}>
              <h3>How booking actually works</h3>
              <ul className="checklist mt">
                <li><Icon name="check" size={16} /> <span><strong>Step 1 — Submit here.</strong> The form on this page sends your request straight into Top Speed Service OS — no hand-off, no second form.</span></li>
                <li><Icon name="check" size={16} /> <span><strong>Step 2 — A setter confirms.</strong> A human Service Setter confirms the job, the window and the pricing before dispatch.</span></li>
                <li><Icon name="check" size={16} /> <span><strong>Step 3 — Track it live.</strong> Follow the job in Service OS with your booking reference and the phone number on the booking.</span></li>
              </ul>
              <div className="mt" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a className="btn btn-outline" href={PHONE_TEL}><Icon name="phone" size={16} /> {PHONE_DISPLAY}</a>
                <button className="btn btn-outline" type="button" onClick={() => go({ kind: 'track' })}><Icon name="track" size={16} /> Track a job</button>
              </div>
            </div>
            <div className="card" style={{ cursor: 'default' }}>
              <h3 style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Icon name="speedy" size={20} /> Prefer the high-tech route?</h3>
              <p style={{ marginTop: '0.4rem' }}>
                Book with <strong>Speedy AI</strong> instead: chat with Speedy, send a photo of the problem for a first
                look, and Speedy shows you a summary to confirm before anything is sent to the setters. Same queue,
                same human confirmation.
              </p>
              <div className="mt" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a className="btn btn-navy btn-sm" href={SERVICE_OS_BOOK_URL} target="_blank" rel="noreferrer"><Icon name="speedy" size={16} /> Book with Speedy AI</a>
                <a className="btn btn-outline btn-sm" href={SERVICE_OS_SPEEDY_URL} target="_blank" rel="noreferrer"><Icon name="chat" size={16} /> Talk to Speedy</a>
              </div>
            </div>
            <div className="notice notice-info">
              <Icon name="shield" size={20} />
              <p><strong>No prices on this site — on purpose.</strong> Pricing is confirmed when you book through Service OS, before any work begins.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── 5. Speedy ───────────────────────────────────────────────── */

function Speedy({ go }: { go: (v: View) => void }) {
  const [appliance, setAppliance] = useState(GUIDE_APPLIANCES[0])
  const symptoms = useMemo(() => GUIDE_RULES.filter((r) => r.appliance === appliance), [appliance])
  const [symptom, setSymptom] = useState(symptoms[0]?.symptom ?? '')
  const rule = GUIDE_RULES.find((r) => r.appliance === appliance && r.symptom === symptom) ?? symptoms[0]

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <span className="pill pill-live">The real Speedy — live at Service OS</span>
          <h1 style={{ marginTop: '0.7rem' }}>Speedy — the network’s AI assistant</h1>
          <p>Speedy is Top Speed’s real AI assistant, and it lives in Top Speed Service OS. Chat with Speedy, send a photo of the problem for a first look, and book in the conversation — every Speedy booking lands in the same Service Setter queue as the form on this site.</p>
          <div className="hero-ctas" style={{ marginTop: '1.3rem' }}>
            <a className="btn btn-orange" href={SERVICE_OS_SPEEDY_URL} target="_blank" rel="noreferrer"><Icon name="speedy" size={18} /> Talk to Speedy</a>
            <a className="btn btn-ghost" href={SERVICE_OS_BOOK_URL} target="_blank" rel="noreferrer"><Icon name="calendar" size={18} /> Book with Speedy AI</a>
            <button className="btn btn-ghost" onClick={() => go({ kind: 'book' })}><Icon name="calendar" size={18} /> Use the booking form</button>
          </div>
        </div>
      </div>
      <section className="block">
        <div className="wrap">
          <div className="grid grid-3">
            <div className="card" style={{ cursor: 'default' }}>
              <span className="ic"><Icon name="chat" size={24} /></span>
              <h3>Talk to Speedy</h3>
              <p>Ask about symptoms, services, cities and what happens next. Speedy answers from the network’s real knowledge — and always keeps the book-or-call path one tap away.</p>
              <a className="go" href={SERVICE_OS_SPEEDY_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Open Speedy chat <Icon name="arrow" size={15} /></a>
            </div>
            <div className="card" style={{ cursor: 'default' }}>
              <span className="ic"><Icon name="speedy" size={24} /></span>
              <h3>Photo first look</h3>
              <p>Send Speedy a photo of the appliance or its model plate and get a structured first look at the problem — what it might be, and what a technician would check.</p>
              <a className="go" href={SERVICE_OS_SPEEDY_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Send a photo to Speedy <Icon name="arrow" size={15} /></a>
            </div>
            <div className="card" style={{ cursor: 'default' }}>
              <span className="ic"><Icon name="calendar" size={24} /></span>
              <h3>Book with Speedy AI</h3>
              <p>Speedy collects the details in conversation, shows you a summary, and sends the booking to the Service Setters only when you confirm it. A human still confirms every job.</p>
              <a className="go" href={SERVICE_OS_BOOK_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Book with Speedy <Icon name="arrow" size={15} /></a>
            </div>
          </div>

          <div className="notice notice-info mt-lg">
            <Icon name="shield" size={20} />
            <p><strong>Honest labels, up front:</strong> Speedy gives a <strong>first look, not a professional diagnosis</strong> — only a technician inspecting the appliance can diagnose it. Speedy never certifies a repair as safe and never issues refunds; those stay with humans, by design.</p>
          </div>

          <h2 className="sec-title mt-lg" style={{ fontSize: '1.35rem' }}>Symptom guide — written reference</h2>
          <p className="sec-sub">Prefer to read first? This is the network’s written symptom guide — plain reference content maintained by the network, not an AI. Pick an appliance and a symptom for likely causes, safety warnings and prep steps.</p>

          <div className="form-card mt-lg">
            <div className="form-grid">
              <label className="f">Appliance
                <select value={appliance} onChange={(e) => { setAppliance(e.target.value); const s = GUIDE_RULES.find((r) => r.appliance === e.target.value); setSymptom(s?.symptom ?? '') }}>
                  {GUIDE_APPLIANCES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>
              <label className="f">Symptom
                <select value={symptom} onChange={(e) => setSymptom(e.target.value)}>
                  {symptoms.map((r) => <option key={r.symptom} value={r.symptom}>{r.symptom}</option>)}
                </select>
              </label>
            </div>
          </div>

          {rule && (
            <div className="split mt-lg">
              <div className="card" style={{ cursor: 'default' }}>
                <h3 style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Icon name="wrench" size={20} /> Likely causes — possibilities only</h3>
                <ul className="prob-list mt">
                  {rule.causes.map((c) => <li key={c}><Icon name="arrow" size={16} /> {c}</li>)}
                </ul>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.9rem' }}>Ordered roughly most-common first for a {rule.appliance.toLowerCase()} that {rule.symptom.toLowerCase()}. Your appliance may have a different cause entirely.</p>
              </div>
              <div className="stack">
                {rule.safety && (
                  <div className="notice notice-warn">
                    <Icon name="alert" size={20} />
                    <p><strong>Safety first:</strong> {rule.safety}</p>
                  </div>
                )}
                <div className="card" style={{ cursor: 'default' }}>
                  <h3>Before the technician arrives</h3>
                  <ul className="checklist mt">
                    {rule.prep.map((p) => <li key={p}><Icon name="check" size={16} /> {p}</li>)}
                  </ul>
                  <div className="mt" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-orange" onClick={() => go({ kind: 'book' })}><Icon name="calendar" size={17} /> Book a technician</button>
                    <a className="btn btn-outline" href={SERVICE_OS_SPEEDY_URL} target="_blank" rel="noreferrer"><Icon name="speedy" size={17} /> Ask Speedy</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ─── 6. Network HQ ───────────────────────────────────────────── */

function HQ({ go }: { go: (v: View) => void }) {
  const maxLeads = Math.max(1, ...NETWORK_STATS.leadsByPage.map((d) => d.leads))
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <span className="pill pill-dark">Network layer</span>
          <h1 style={{ marginTop: '0.7rem' }}>Network HQ</h1>
          <p>The whole fleet on one page: every service page and city page, the sister brands each page can hand off to, and the single routing path every lead takes.</p>
        </div>
      </div>
      <section className="block">
        <div className="wrap stack">
          <div>
            <h2 className="sec-title" style={{ fontSize: '1.35rem' }}>How a lead moves through the network</h2>
            <div className="mt"><RoutingDiagram /></div>
          </div>

          <div>
            <h2 className="sec-title" style={{ fontSize: '1.35rem' }}>Fleet index — service pages (10)</h2>
            <div className="table-scroll mt">
              <table className="fleet">
                <thead><tr><th>Page</th><th>Type</th><th>Routes to</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {SERVICES.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>Service page</td>
                      <td>Service OS setters</td>
                      <td><span className="pill pill-live">Live</span></td>
                      <td><button className="link" onClick={() => go({ kind: 'service', id: s.id })}>Open</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="sec-title" style={{ fontSize: '1.35rem' }}>Fleet index — city pages (16)</h2>
            <div className="table-scroll mt">
              <table className="fleet">
                <thead><tr><th>Page</th><th>Network tier</th><th>Services offered</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {CITIES.map((c) => (
                    <tr key={c.id}>
                      <td><strong>Appliance Repair in {c.name}</strong></td>
                      <td>{c.core ? 'Core city' : 'Network city'}</td>
                      <td>All 10 services</td>
                      <td><span className="pill pill-live">Live</span></td>
                      <td><button className="link" onClick={() => go({ kind: 'city', id: c.id })}>Open</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.7rem' }}>Plus this hub itself — 27 pages in the fleet, one booking system behind all of them.</p>
          </div>

          <div>
            <h2 className="sec-title" style={{ fontSize: '1.35rem' }}>Sister brands in the network</h2>
            <div className="grid grid-3 mt">
              {SISTER_BRANDS.map((b) => (
                <div key={b.name} className="card" style={{ cursor: 'default' }}>
                  <span className="ic"><Icon name="layers" size={24} /></span>
                  <h3>{b.name}</h3>
                  <p><strong style={{ color: 'var(--navy)' }}>{b.role}.</strong> {b.note}</p>
                  <a className="go" href={b.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Visit site <Icon name="arrow" size={15} /></a>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>Network stats — production</h3>
              <span className="pill pill-live">Live · reset to zero Nov 17, 2026</span>
            </div>
            <p style={{ marginTop: '0.4rem' }}>{NETWORK_STATS.note}</p>
            <div className="stack mt">
              {NETWORK_STATS.leadsByPage.map((d) => (
                <div key={d.page} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 2fr 40px', gap: '0.8rem', alignItems: 'center', fontSize: '0.92rem' }}>
                  <span>{d.page}</span>
                  <span className="bar"><i style={{ width: `${(d.leads / maxLeads) * 100}%` }} /></span>
                  <strong>{d.leads}</strong>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.8rem' }}>“Leads by page” — every counter was reset to zero at the production launch. Jobs and leads are recorded in Service OS, the network’s system of record.</p>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── 7. Track ────────────────────────────────────────────────── */

function Track({ go }: { go: (v: View) => void }) {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <span className="pill pill-live">Production</span>
          <h1 style={{ marginTop: '0.7rem' }}>Track a job</h1>
          <p>Live job tracking runs in Top Speed Service OS and the Appliance Connect customer portal — that is where your job record lives from confirmation to done. This page hands you straight to it.</p>
        </div>
      </div>
      <section className="block">
        <div className="wrap split">
          <div className="form-card">
            <h2 style={{ color: 'var(--navy)', fontSize: '1.2rem' }}>Track your job in Service OS</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', margin: '0.3rem 0 1rem' }}>
              Service OS tracking asks for two things: your <strong>booking reference</strong> — shown on the
              confirmation when you booked, it looks like TS-XXXXXX — and the <strong>phone number</strong> on the
              booking. Enter both there and you’ll see your job’s live stage.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a className="btn btn-orange" href={SERVICE_OS_TRACK_URL} target="_blank" rel="noreferrer"><Icon name="track" size={17} /> Track your job in Service OS</a>
              <a className="btn btn-outline" href="https://appliance-connect.vercel.app" target="_blank" rel="noreferrer">Open Appliance Connect</a>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
              No reference handy? Call <a href={PHONE_TEL}><strong>{PHONE_DISPLAY}</strong></a> and a setter will update you.
            </p>
          </div>
          <div>
            <div className="card" style={{ cursor: 'default' }}>
              <span className="ic"><Icon name="track" size={24} /></span>
              <h3>The stages every confirmed job moves through</h3>
              <ul className="timeline">
                {TRACKING_STAGES.map((st) => (
                  <li key={st}>
                    <span className="dot"></span>
                    <span>
                      <span className="t-name">{st}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>A human setter confirms every job before a technician is dispatched — no web form dispatches or charges on its own.</p>
              <div className="mt" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-sm" onClick={() => go({ kind: 'book' })}>Book a repair</button>
                <a className="btn btn-outline btn-sm" href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── 8. About / Contact ──────────────────────────────────────── */

function About({ go }: { go: (v: View) => void }) {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>About the network</h1>
          <p>Total Home Appliance Repair is the residential appliance repair network of Top Speed Appliance — built so a homeowner anywhere in Broward finds one clear page for their problem and their city, and lands in one well-run booking system.</p>
        </div>
      </div>
      <section className="block">
        <div className="wrap split">
          <div className="stack">
            <div className="card" style={{ cursor: 'default' }}>
              <h3>Why a network?</h3>
              <p style={{ marginTop: '0.4rem' }}>
                A single page can’t answer “dryer repair in Weston” and “refrigerator repair in Coral Springs” equally well.
                So the network splits the job: <strong>service pages</strong> go deep on each appliance, <strong>city pages</strong> localize
                the same fleet, and this <strong>hub</strong> holds it together. Behind all of it sits one operating system —
                Top Speed Service OS — where human Service Setters confirm every job before dispatch. No page freelances;
                no lead lands in a dead inbox.
              </p>
            </div>
            <div className="card" style={{ cursor: 'default' }}>
              <h3>Part of a bigger family</h3>
              <p style={{ marginTop: '0.4rem' }}>
                When a repair turns into a replacement, Appliance Express sources the new unit. When the real problem is a
                clogged vent, Clean Out Vents cleans the run. When a job needs a part, Appliance Plus matches it. And
                customers follow their jobs in Appliance Connect. It’s one ecosystem, coordinated by Gateway Express.
              </p>
              <div className="mt"><button className="btn btn-navy btn-sm" onClick={() => go({ kind: 'hq' })}>See the full network at HQ <Icon name="arrow" size={15} /></button></div>
            </div>
          </div>
          <div className="stack">
            <div className="card" style={{ cursor: 'default' }}>
              <h3>Contact the network</h3>
              <ul className="checklist mt">
                <li><Icon name="phone" size={16} /> <span>Call or text: <a href={PHONE_TEL}><strong>{PHONE_DISPLAY}</strong></a></span></li>
                <li><Icon name="mail" size={16} /> <span>Email: <a href={`mailto:${EMAIL}`}><strong>{EMAIL}</strong></a></span></li>
                <li><Icon name="route" size={16} /> <span>Bookings: submitted and confirmed through <a href={SERVICE_OS_URL} target="_blank" rel="noreferrer"><strong>topspeedserviceos.com</strong></a></span></li>
              </ul>
            </div>
            <div className="card" style={{ cursor: 'default' }}>
              <h3>Service area</h3>
              <p style={{ marginTop: '0.4rem' }}>Broward County, Florida. Core cities: Coral Springs, Sunrise, Plantation and Fort Lauderdale — plus Coconut Creek, Pompano Beach, Deerfield Beach, Margate, Tamarac, Davie, Weston, Parkland, Lauderhill, Hollywood, Pembroke Pines and Miramar on their own city pages.</p>
              <div className="mt"><button className="btn btn-outline btn-sm" onClick={() => go({ kind: 'cities' })}><Icon name="pin" size={15} /> Browse all 16 city pages</button></div>
            </div>
            <div className="notice notice-info">
              <Icon name="shield" size={20} />
              <p><strong>How we work:</strong> every request is confirmed by a human Service Setter before dispatch, and pricing is confirmed when you book through Service OS — before any work starts.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── Footer ──────────────────────────────────────────────────── */

function Footer({ go }: { go: (v: View) => void }) {
  return (
    <footer className="site">
      <div className="footer-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Logo size={38} />
            <div>
              <div style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, lineHeight: 1.15 }}>Total Home Appliance Repair</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ffb287', fontWeight: 700 }}>A Top Speed Appliance Network</div>
            </div>
          </div>
          <p style={{ marginTop: '0.9rem', fontSize: '0.9rem', maxWidth: 300 }}>
            One hub, 10 service pages and 16 city pages across Broward County — every booking routed through Top Speed Service OS and confirmed by a Service Setter.
          </p>
          <p style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
            Call or text <a href={PHONE_TEL} style={{ color: '#fff', fontWeight: 700 }}>{PHONE_DISPLAY}</a><br />
            <a href={`mailto:${EMAIL}`} style={{ color: '#fff' }}>{EMAIL}</a>
          </p>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            {SERVICES.slice(0, 6).map((s) => <li key={s.id}><button onClick={() => go({ kind: 'service', id: s.id })}>{s.name}</button></li>)}
            <li><button onClick={() => go({ kind: 'services' })}>All services →</button></li>
          </ul>
        </div>
        <div>
          <h4>Core cities</h4>
          <ul>
            {CITIES.filter((c) => c.core).map((c) => <li key={c.id}><button onClick={() => go({ kind: 'city', id: c.id })}>Repair in {c.name}</button></li>)}
            <li><button onClick={() => go({ kind: 'cities' })}>All 16 city pages →</button></li>
          </ul>
        </div>
        <div>
          <h4>Network</h4>
          <ul>
            <li><button onClick={() => go({ kind: 'book' })}>Book a repair</button></li>
            <li><button onClick={() => go({ kind: 'speedy' })}>Speedy</button></li>
            <li><button onClick={() => go({ kind: 'track' })}>Track a job</button></li>
            <li><button onClick={() => go({ kind: 'hq' })}>Network HQ</button></li>
            <li><a href={SERVICE_OS_SIGNIN_URL} target="_blank" rel="noreferrer">Sign in</a></li>
            <li><a href={SERVICE_OS_RESET_URL} target="_blank" rel="noreferrer">Forgot password</a></li>
            {SISTER_BRANDS.slice(0, 3).map((b) => (
              <li key={b.name}><a href={b.url} target="_blank" rel="noreferrer">{b.name}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-base">
        Total Home Appliance Repair — the residential appliance repair network of Top Speed Appliance · Broward County, FL.
        Pricing is confirmed when you book through Service OS.
      </div>
    </footer>
  )
}
