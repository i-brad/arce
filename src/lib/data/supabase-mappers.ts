import type { Client, Company, InvoiceDocument } from "./types"

export interface CompanyRow {
  id: string
  user_id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  twitter: string | null
  tiktok: string | null
  linkedin: string | null
  reg_no: string | null
  default_template: string
  signatory_role: string | null
  signatory_name: string | null
  logo: string | null
  signature: string | null
  pattern_image: string | null
}

export interface ClientRow {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  created_at: string
}

export interface DocumentRow {
  id: string
  client_id: string | null
  type: string
  number: string
  date: string
  template: string
  font: string
  show_pattern: boolean
  show_total: boolean
  status: string
  title: string | null
  salutation: string | null
  body: string | null
  breakdown_heading: string | null
  closing: string | null
  thanks: string | null
  signatory_role: string | null
  sections: unknown
  created_at: string
  updated_at: string
}

const s = (value: string | null | undefined) => value ?? ""
const template = (value: string): Company["defaultTemplate"] =>
  (["estate", "minimal", "navy", "terracotta"] as const).includes(value as never)
    ? (value as Company["defaultTemplate"])
    : "estate"
const font = (value: string): InvoiceDocument["font"] =>
  value === "fraunces" ? "fraunces" : "carlito"
const docType = (value: string): InvoiceDocument["type"] =>
  value === "invoice" ? "invoice" : "acknowledgement"
const docStatus = (value: string): InvoiceDocument["status"] =>
  value === "sent" ? "sent" : "draft"

export function mapCompany(row: CompanyRow): Company {
  return {
    id: row.id,
    name: row.name,
    address: s(row.address),
    phone: s(row.phone),
    email: s(row.email),
    whatsapp: s(row.whatsapp),
    website: s(row.website),
    instagram: s(row.instagram),
    facebook: s(row.facebook),
    twitter: s(row.twitter),
    tiktok: s(row.tiktok),
    linkedin: s(row.linkedin),
    regNo: s(row.reg_no),
    defaultTemplate: template(row.default_template),
    signatoryRole: s(row.signatory_role),
    signatoryName: s(row.signatory_name),
    logo: s(row.logo),
    signature: s(row.signature),
    patternImage: s(row.pattern_image),
  }
}

export function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    address: s(row.address),
    phone: s(row.phone),
    email: s(row.email),
    createdAt: row.created_at,
  }
}

export function mapDocument(row: DocumentRow): InvoiceDocument {
  return {
    id: row.id,
    type: docType(row.type),
    number: row.number,
    date: row.date,
    clientId: s(row.client_id),
    title: s(row.title),
    salutation: s(row.salutation),
    body: s(row.body),
    breakdownHeading: s(row.breakdown_heading),
    sections: Array.isArray(row.sections) ? (row.sections as InvoiceDocument["sections"]) : [],
    showTotal: row.show_total,
    closing: s(row.closing),
    thanks: s(row.thanks),
    signatoryRole: s(row.signatory_role),
    template: template(row.template),
    font: font(row.font),
    showPattern: row.show_pattern,
    status: docStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function toCompanyRow(userId: string, c: Company): Record<string, unknown> {
  return {
    user_id: userId,
    name: c.name,
    address: c.address,
    phone: c.phone,
    email: c.email,
    whatsapp: c.whatsapp,
    website: c.website,
    instagram: c.instagram,
    facebook: c.facebook,
    twitter: c.twitter,
    tiktok: c.tiktok,
    linkedin: c.linkedin,
    reg_no: c.regNo,
    default_template: c.defaultTemplate,
    signatory_role: c.signatoryRole,
    signatory_name: c.signatoryName,
    logo: c.logo,
    signature: c.signature,
    pattern_image: c.patternImage,
  }
}

export function toClientRow(userId: string, c: Client): Record<string, unknown> {
  return {
    user_id: userId,
    name: c.name,
    address: c.address,
    phone: c.phone,
    email: c.email,
  }
}

export function toDocumentRow(userId: string, d: InvoiceDocument): Record<string, unknown> {
  return {
    user_id: userId,
    client_id: d.clientId || null,
    type: d.type,
    number: d.number,
    date: d.date,
    template: d.template,
    font: d.font,
    show_pattern: d.showPattern,
    show_total: d.showTotal,
    status: d.status,
    title: d.title,
    salutation: d.salutation,
    body: d.body,
    breakdown_heading: d.breakdownHeading,
    closing: d.closing,
    thanks: d.thanks,
    signatory_role: d.signatoryRole,
    sections: d.sections,
  }
}
