# Invoicing for Real Estates — Design spec

Built from the reference file: `assets/Acknowledgment Letter for MR OLUWAFEMI ALOFE OLUWADAMILARE 8th april.pdf` (Silver Pacific Homes, Nigeria).

## What this is not

- Not a SaaS dashboard with charts and dark-mode flair. It's a back-office tool whose job is producing one perfect A4 document.
- Not a generic Stripe-style invoice with neon accents and rounded cards.
- Not a toy — it's the working tool of a real estate office that sends money-related letters to clients every week.

## How it should feel

- **Official.** Bank-letter / legal-document formality. The generated document must look like it came from a law firm or a developer's office, not Canva.
- **Calm.** One ink color, generous white space, black-on-white document, restrained UI.
- **Typographic.** The document is the product. Calibri-fidelity, A4 proportions, hairline rules.
- **Efficient.** Create a client, pick them, add line items, done. Under a minute to a PDF.

## Avoid

- Rounded corners everywhere, shadows, gradients, purple/blue SaaS gradients.
- Dashboards stuffed with cards and stat tiles.
- Emoji, decorative icons in the document.
- Comic-sans-adjacent or techy fonts (Inter/Geist are fine for the app UI, NOT for the document — the document stays serif/Calibri-class).
- Dark mode (single-color document product, keep the app light).

## The test

Every decision must answer:
**"Could this document be handed to a client by a professional real-estate firm without a second thought?"**
If no, simplify it.

## Fixed requirements

- Next.js (App Router), TypeScript, Tailwind CSS.
- Client management + document builder + live A4 preview + PDF export.
- Data in localStorage behind a repository interface so a real DB can be swapped in later.
- PDF produced with a PDF library (react-pdf family).
- Generated document mirrors the reference letter structure:
  - Date top-right
  - Client name + address block
  - Salutation
  - Centered bold title ("LETTER OF ACKNOWLEDGEMENT" / "INVOICE")
  - Body paragraphs
  - Breakdown of line items with amounts (₦ Naira)
  - Totals / balance section
  - Signature block with sender's role and company
- Currency: Nigerian Naira, formatted like `N 3,700,000`.

## Reference document anatomy (from the PDF text layer)

1. Date, top-right, all-caps: `8TH APRIL, 2022`
2. Addressee block: name line, then address lines
3. `Dear Sir,`
4. Centered title: `LETTER OF ACKNOWLEDGEMENT`
5. Body: acknowledges payment, describes what it covers, excludes fees
6. `The breakdown of the amount paid is as follows;`
7. Breakdown list (description — amount pairs), Naira amounts
8. Statutory fees sub-lines, then total balance
9. Closing paragraph + thanks + best regards
10. Signature: role line, `For: <Company Name>`
11. A4 portrait, Calibri body text, black on white
