# Acre

Invoicing and payment acknowledgment letters for real estate agents.

Acre is a local-first web app for drafting, previewing, and exporting the
formal acknowledgment letters and invoices agents send to property buyers.
Everything is stored in your browser — no account, no server.

## Features

- **Acknowledgment letters & invoices** — build a letter from reusable
  fields: type, reference, date, client, salutation, body, breakdown of
  line items, closing, and signature block.
- **Placeholders in the body** — use `{amount}`, `{words}`, `{total}` and
  `{totalWords}` so figures are written out (in naira words) automatically
  and stay in sync with your line items.
- **Live A4 preview** — the document renders exactly as it prints, updating
  as you type.
- **Templates** — Estate, Minimal, Navy, and Terracotta, each with a custom
  header band, footer wave, and background pattern.
- **Fonts** — Carlito and Fraunces.
- **Custom background pattern** — upload your own pattern image or use the
  built-in flower pattern.
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

The app seeds a sample company, client, and letter on first run so you can
explore before entering your own data.

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
