import type { Company, DocType, InvoiceDocument } from "@/lib/data/types";
import { newDocument } from "@/lib/documents/document-utils";
import { uid } from "@/lib/utils/id";

export interface SampleDoc {
  key: string;
  type: DocType;
  title: string;
  description: string;
}

export const SAMPLE_DOCS: SampleDoc[] = [
  {
    key: "acknowledgement",
    type: "acknowledgement",
    title: "Acknowledgment letter",
    description: "Receipt-style letter confirming a payment on a transaction.",
  },
  {
    key: "invoice",
    type: "invoice",
    title: "Invoice",
    description:
      "Breakdown of the balance due with line items and a running total.",
  },
];

export function sampleDocument(
  type: DocType,
  company: Company,
): InvoiceDocument {
  const doc = newDocument(type, company);
  doc.salutation = "Dear Sir,";
  doc.status = "draft";
  doc.showTotal = true;

  const year = new Date().getFullYear();

  if (type === "invoice") {
    doc.number = `INV-${year}-001`;
    doc.title = "INVOICE";
    doc.body =
      "This is to acknowledge the receipt of your payment of {words} ({amount}) towards the under-listed items. Kindly note the breakdown of the balance due is as follows;";
    doc.breakdownHeading = "The breakdown of the balance due is as follows;";
    doc.sections = [
      {
        id: uid("sec"),
        label: null,
        items: [
          {
            id: uid("it"),
            description:
              "Balance due on three (3) plots of land (measuring 1800SQM)",
            amount: 4200000,
          },
          {
            id: uid("it"),
            description: "Survey plan and documentation fees",
            amount: 450000,
          },
          { id: uid("it"), description: "Development levy", amount: 900000 },
        ],
      },
    ];
    doc.closing =
      "Kindly contact us should you require any further information regarding this invoice.";
    doc.thanks = "Thank you for subscribing to Casa Khanya Estate.";
    return doc;
  }

  doc.number = `ACK-${year}-001`;
  doc.title = "LETTER OF ACKNOWLEDGEMENT";
  doc.body =
    "This is to acknowledge the receipt of your Payment of {words} ({amount}) as part payment for three (3) plots of land measuring 1800SQM in Casa Khanya Estate, Olorunda, Akobo, Ibadan. This payment excludes fees for Deed of Assignment, Survey Plan and Developmental fee.";
  doc.breakdownHeading = "The breakdown of the amount paid is as follows;";
  doc.sections = [
    {
      id: uid("sec"),
      label: null,
      items: [
        {
          id: uid("it"),
          description:
            "Amount paid for three (3) plots of land (measuring 1800SQM)",
          amount: 3700000,
        },
        {
          id: uid("it"),
          description: "Balance payment for land",
          amount: 500000,
        },
      ],
    },
    {
      id: uid("sec"),
      label: "STATUTORY FEES",
      items: [
        {
          id: uid("it"),
          description: "Amount to be paid for Survey",
          amount: 300000,
        },
        {
          id: uid("it"),
          description: "Amount to be paid for Deed of Assignment",
          amount: 150000,
        },
        {
          id: uid("it"),
          description: "Amount to be paid for Development levy",
          amount: 900000,
        },
        {
          id: uid("it"),
          description: "Total balance to be paid",
          amount: 1850000,
        },
      ],
    },
  ];
  doc.closing =
    "Kindly ensure you go through the “frequently asked questions (FAQ)” for more details on this estate scheme, we would be in contact with you regarding progress report on the estate.";
  doc.thanks =
    "Thank you for subscribing to Casa Khanya Estate a development by Casa khanya Homes.";
  return doc;
}
