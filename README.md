# Acre

Invoicing and payment acknowledgment letters for service businesses.

Acre is a local-first web app for drafting, previewing, and exporting the
formal acknowledgment letters and invoices you send to clients. Everything is
stored in your browser (IndexedDB) — no database, no cloud service, no
accounts, and no server-side storage.

## Features

- **Acknowledgment letters & invoices** — build a letter from reusable
  fields: type, reference, date, client, salutation, body, breakdown of
  line items, closing, and signature block.
- **Placeholders in the body** — use `{amount}`, `{words}`, `{total}` and
  `{totalWords}` so figures are written out (in naira words) automatically
  and stay in sync with your line items.
- **Live A4 preview** — the document renders exactly as it prints, updating
  as you type.
- **Templates & layouts** — different page layouts (Band, Classic letterhead,
  Banner) with a choice of colour themes per layout, each with its own header,
  footer wave, and background pattern.
- **Fonts** — Carlito and Fraunces.
- **Custom background pattern** — upload a single icon image; it is repeated
  as a tiled pattern, or use the built-in flower pattern.
- **Clients** — manage a contact list, with phone and email shown on the
  letter.
- **Company details & branding** — logo, signature (upload or draw), contact
  details, socials, and document defaults.
- **Export** — download a print-ready one-page PDF, or print directly to A4.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see
the result.

Your company, clients and documents live in the browser's IndexedDB, so the
app works on any static host — including Vercel — with no backend at all.
Uploaded images (logo, signature, pattern) are downscaled and stored in the
browser too. A sample company is seeded on first run; no sample clients or
documents are created automatically. Data is tied to one browser on one
device; use the same browser to keep your data.

## Scripts

```bash
npm run dev        # start the development server
npm run build      # production build
npm run lint       # lint
npm run verify     # end-to-end checks (Playwright, needs dev server)
```

## Tech

Next.js (App Router), React, TypeScript, Tailwind CSS, and
@react-pdf/renderer for PDF export.

---

Built by [worksbybrad.xyz](https://worksbybrad.xyz).
