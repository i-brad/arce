import type { TemplateId } from "@/lib/documents/theme";

export type DocType = "acknowledgement" | "invoice";

export type DocStatus = "draft" | "sent";

export type DocFont = "carlito" | "fraunces";

export interface Company {
  id: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  linkedin: string;
  regNo: string;
  logo: string;
  signature: string;
  patternImage: string;
  signatoryName: string;
  signatoryRole: string;
  defaultTemplate: TemplateId;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  amount: number;
}

export interface ItemSection {
  id: string;
  label: string | null;
  items: LineItem[];
}

export interface InvoiceDocument {
  id: string;
  type: DocType;
  number: string;
  phase: string;
  date: string;
  clientId: string;
  title: string;
  salutation: string;
  body: string;
  breakdownHeading: string;
  sections: ItemSection[];
  showTotal: boolean;
  closing: string;
  thanks: string;
  signatoryRole: string;
  template: TemplateId;
  font: DocFont;
  showPattern: boolean;
  showCompanyDetails: boolean;
  status: DocStatus;
  createdAt: string;
  updatedAt: string;
}

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  acknowledgement: "Acknowledgment letter",
  invoice: "Invoice",
};
