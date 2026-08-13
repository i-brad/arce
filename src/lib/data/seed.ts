import type { Client, Company, InvoiceDocument } from "./types"
import { uid } from "@/lib/utils/id"

export function seedCompany(): Company {
  return {
    id: "company_default",
    name: "Silver Pacific Homes",
    address: "Southern Atlantic Estate, Okun Imosan, Ibeju Lekki, Lagos",
    phone: "",
    email: "",
    whatsapp: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
    linkedin: "",
    regNo: "",
    logo: "",
    signature: "",
    patternImage: "",
    signatoryName: "",
    signatoryRole: "Director of Operations",
    defaultTemplate: "estate",
  }
}

export function seedClients(): Client[] {
  return [
    {
      id: "client_alofe",
      name: "MR OLUWAFEMI ALOFE OLUWADAMILARE",
      address: "NO 13, YEMI FAROUNBI, NEW BODIJA, IBADAN, OYO STATE.",
      phone: "",
      email: "",
      createdAt: new Date().toISOString(),
    },
  ]
}

export function seedDocuments(): InvoiceDocument[] {
  const now = new Date().toISOString()
  return [
    {
      id: "doc_alofe_ack",
      type: "acknowledgement",
      number: "ACK-2022-001",
      date: "2022-04-08",
      clientId: "client_alofe",
      title: "LETTER OF ACKNOWLEDGEMENT",
      salutation: "Dear Sir,",
      body:
        "This is to acknowledge the receipt of your Payment of {words} ({amount}) as part payment for three (3) plots of land measuring 1800SQM in Southern Atlantic Estate, Okun Imosan, Ibeju Lekki Lagos. This payment excludes fees for Deed of Assignment, Survey Plan and Developmental fee.",
      breakdownHeading: "The breakdown of the amount paid is as follows;",
      sections: [
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
            { id: uid("it"), description: "Amount to be paid for Survey", amount: 300000 },
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
      ],
      showTotal: false,
      closing:
        "Kindly ensure you go through the “frequently asked questions (FAQ)” for more details on this estate scheme, we would be in contact with you regarding progress report on the estate.",
      thanks: "Thank you for subscribing to Southern Atlantic Estate a development by Silver Pacific Homes.",
      signatoryRole: "DIRECTOR OF OPERATIONS",
      template: "estate",
      font: "carlito",
      status: "sent",
      createdAt: now,
      updatedAt: now,
    },
  ]
}
