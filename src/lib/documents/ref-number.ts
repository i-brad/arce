import type { Company, InvoiceDocument } from "@/lib/data/types";

const GENERIC_WORDS = new Set([
  "homes",
  "home",
  "estate",
  "estates",
  "properties",
  "property",
  "group",
  "company",
  "co",
  "ltd",
  "llc",
  "inc",
  "limited",
  "realty",
  "realtors",
  "developers",
  "development",
  "developments",
]);

export function companyInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  const significant = words.filter(
    (w) => !GENERIC_WORDS.has(w.toLowerCase().replace(/[^a-z]/gi, "")),
  );
  const source = significant.length > 0 ? significant : words;
  const initials = source.map((w) => w[0]?.toUpperCase() ?? "").join("");
  return initials || "DOC";
}

function yearOf(dateIso: string): string {
  const year = dateIso?.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : String(new Date().getFullYear());
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Suggests the next reference number, e.g. "CK-PH1-2026-004". Purely a
 * starting point — the field stays freely editable after this. */
export function suggestRefNumber(
  documents: InvoiceDocument[],
  company: Company,
  phase: string,
  date: string,
): string {
  const prefix = [companyInitials(company.name), phase.trim(), yearOf(date)]
    .filter(Boolean)
    .join("-");

  const pattern = new RegExp(`^${escapeRegExp(prefix)}-(\\d+)$`);
  let max = 0;
  for (const doc of documents) {
    const match = doc.number.match(pattern);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}
