import type { Client, Company, InvoiceDocument } from "./types"

export interface Repository {
  getCompany(): Promise<Company>
  saveCompany(company: Company): Promise<void>
  listClients(): Promise<Client[]>
  getClient(id: string): Promise<Client | undefined>
  saveClient(client: Client): Promise<void>
  deleteClient(id: string): Promise<void>
  listDocuments(): Promise<InvoiceDocument[]>
  getDocument(id: string): Promise<InvoiceDocument | undefined>
  saveDocument(doc: InvoiceDocument): Promise<void>
  deleteDocument(id: string): Promise<void>
}
