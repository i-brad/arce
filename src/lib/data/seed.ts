import type { Company } from "./types"

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
