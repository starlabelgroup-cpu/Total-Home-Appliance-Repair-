# Total Home Appliance Repair — Appliance Repair Website Network

The residential appliance repair network of **Top Speed Appliance**: one master
hub plus a fleet of landing pages (10 service pages × 16 Broward County city
pages), where every page routes its bookings to one place — Top Speed Service
OS and its human Service Setters.

React 18 + TypeScript + Vite 5 single-page app with client-side navigation.

## Screens

1. **Network Hub** — hero, services grid, how the network works, network structure.
2. **Services** — 10 services, each with a detail view (common problems, what the tech checks, preselected booking).
3. **City Pages** — one template rendered per city (16 cities) from a single city × service data table, plus a fleet index.
4. **Book** — booking-prep form (see honesty rules).
5. **Speedy** — local rule-based guide demo (see honesty rules).
6. **Network HQ** — fleet tables, sister-brand cards with real links, lead-routing diagram, demo stats.
7. **Track** — job tracking preview with labeled demo data (try `DEMO-1042`).
8. **About/Contact** — network story, phone/email, service area.

## Honesty model (hard rules)

- **No prices anywhere.** Pricing is confirmed when booking through Service OS.
- **No invented hours, addresses, ratings, review counts, technician counts, or guarantees.**
- **Booking form is a local draft only.** It saves to `sessionStorage`
  (key `thar-booking-draft`), is stamped "LOCAL DRAFT ONLY — not submitted",
  captures UTM params + `gclid` into the draft, and directs the customer to
  https://topspeedserviceos.com to submit the real request. It never claims a
  lead was sent.
- **Speedy is a local rule-based demo** — not a live AI, not connected to
  Service OS, and its output is possibilities, **not a professional diagnosis**.
  Safety warnings (gas, electrical, refrigerant, microwave high voltage) are
  built into the rules.
- **Demo data is always labeled** ("Demo data" / "Live in this demo") —
  tracking timeline and Network HQ stats are illustrative only.
- Real facts used: phone 954-931-7997, email service@topspeedappliance.net,
  Broward County service area, and the six real sister-brand sites.

## Develop

```bash
npm install
npm run dev
npm run build   # tsc -b && vite build — must pass clean
```
