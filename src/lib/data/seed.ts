import type { Company } from "./types";

export function seedCompany(): Company {
  return {
    id: "company_default",
    name: "Casa khanya Homes",
    tagline: "",
    address: "Casa Khanya Estate, Olorunda, Akobo, Ibadan",
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
  };
}
