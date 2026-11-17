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
4. **Book** — real booking form that submits to Top Speed Service OS (see honesty rules).
5. **Speedy** — the real Speedy AI at Service OS (chat, photo first look, booking), plus the on-site written symptom guide (see honesty rules).
6. **Network HQ** — fleet tables, sister-brand cards with real links, lead-routing diagram, production network counters (reset to zero at launch).
7. **Track** — handoff to live job tracking in Service OS (booking reference + phone number).
8. **About/Contact** — network story, phone/email, service area.

## Honesty model (hard rules)

- **No prices anywhere.** Pricing is confirmed when booking through Service OS.
- **No invented hours, addresses, ratings, review counts, technician counts, or guarantees.**
- **The booking form really submits.** It POSTs to the Service OS public
  intake (`POST /api/v1/speedy/book` on the Service OS API — the same intake
  the flagship booking form uses) with the customer's name, phone, city,
  ZIP, service, problem description and preferred window, plus UTM params
  and ad click IDs (`gclid` / `fbclid` / `msclkid`) captured from the
  landing URL. On success it shows the real booking reference the API
  returns; on failure it says plainly that nothing was submitted and gives
  the call path. Out-of-area responses are shown honestly (request saved,
  no visit booked). The form leads the Book screen; booking with Speedy AI
  is the secondary option below it.
- **Speedy is the real Speedy AI at Top Speed Service OS** — this site
  links to it (chat and photo first look at
  https://topspeedserviceos.com/speedy, booking at
  https://topspeedserviceos.com/book). Nothing on this site imitates
  Speedy locally. The on-site symptom guide is written reference content —
  possibilities, **not a professional diagnosis** — and is labeled as a
  guide, never as Speedy or an AI. Safety warnings (gas, electrical,
  refrigerant, microwave high voltage) are built into the guide.
- **Network HQ stats are production counters**, reset to zero at the
  production launch (Nov 17, 2026). Bookings and leads themselves are
  recorded in Service OS, the network's system of record. Job tracking is
  a handoff to Service OS — this site holds no job records.
- Real facts used: phone 954-931-7997, email service@topspeedappliance.net,
  Broward County service area, and the six real sister-brand sites.

## Develop

```bash
npm install
npm run dev
npm run build   # tsc -b && vite build — must pass clean
```
