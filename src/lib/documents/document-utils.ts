import type { Company, DocType, InvoiceDocument, LineItem } from "@/lib/data/types"
import { formatNaira, numberToNairaWords } from "@/lib/utils/currency"
import { uid } from "@/lib/utils/id"

export function allItems(doc: Pick<InvoiceDocument, "sections">): LineItem[] {
  return doc.sections.flatMap((section) => section.items)
}

export function firstItem(doc: Pick<InvoiceDocument, "sections">): LineItem | undefined {
  return allItems(doc)[0]
}

export function totalOf(doc: Pick<InvoiceDocument, "sections">): number {
  return allItems(doc).reduce((sum, item) => sum + item.amount, 0)
}

export function renderTemplate(
  template: string,
  doc: Pick<InvoiceDocument, "sections">,
): string {
  const first = firstItem(doc)
  const total = totalOf(doc)
  const values: Record<string, string> = {
    amount: first ? formatNaira(first.amount) : "—",
    words: first ? numberToNairaWords(first.amount) : "—",
    total: formatNaira(total),
    totalWords: numberToNairaWords(total),
  }
  return template.replace(/\{(amount|words|total|totalWords)\}/g, (_, key: string) => values[key] ?? "")
}

export function newLineItem(): LineItem {
  return { id: uid("it"), description: "", amount: 0 }
}
export function today(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

export function companyContactLine(company: Company): string {
  const parts = [
    company.address,
    company.phone,
    company.whatsapp ? `WhatsApp: ${company.whatsapp}` : "",
    company.email,
  ].filter(Boolean)
  return parts.join(" • ")
}

export function companySocialsLine(company: Company): string {
  const parts = [
    company.website ? `Website: ${company.website}` : "",
    company.instagram ? `Instagram: ${company.instagram}` : "",
    company.facebook ? `Facebook: ${company.facebook}` : "",
    company.twitter ? `X: ${company.twitter}` : "",
    company.tiktok ? `TikTok: ${company.tiktok}` : "",
    company.linkedin ? `LinkedIn: ${company.linkedin}` : "",
  ].filter(Boolean)
  return parts.join(" • ")
}

const LETTER_MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
]

export function formatLetterDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const suffix =
    d % 10 === 1 && d !== 11 ? "ST" : d % 10 === 2 && d !== 12 ? "ND" : d % 10 === 3 && d !== 13 ? "RD" : "TH"
  return `${d}${suffix} ${LETTER_MONTHS[m - 1]}, ${y}`
}

export function newDocument(type: DocType, company: Company): InvoiceDocument {
  const now = new Date().toISOString()
  const invoice = type === "invoice"
  return {
    id: uid("doc"),
    type,
    number: "",
    date: today(),
    clientId: "",
    title: invoice ? "INVOICE" : "LETTER OF ACKNOWLEDGEMENT",
    salutation: "Dear Sir/Madam,",
    body: invoice
      ? "This is to acknowledge the receipt of your payment of {words} ({amount}) towards the following:\n\nKindly note the breakdown of the amount due is as follows;"
      : "This is to acknowledge the receipt of your payment of {words} ({amount}) towards the under-listed property transaction. This payment excludes statutory fees where applicable.",
    breakdownHeading: invoice
      ? "The breakdown of the amount due is as follows;"
      : "The breakdown of the amount paid is as follows;",
    sections: [
      {
        id: uid("sec"),
        label: null,
        items: [{ id: uid("it"), description: "", amount: 0 }],
      },
    ],
    showTotal: true,
    closing:
      "Kindly contact us should you require any further information regarding this letter.",
    thanks: "Thank you for your continued patronage.",
    signatoryRole: company.signatoryRole,
    template: company.defaultTemplate,
    font: "carlito",
    showPattern: false,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  }
}
