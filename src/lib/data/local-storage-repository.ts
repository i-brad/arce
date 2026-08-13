import type { Client, Company, InvoiceDocument } from "./types"
import type { Repository } from "./repository"
import { seedCompany } from "./seed"

const KEY_COMPANY = "ire:company"
const KEY_CLIENTS = "ire:clients"
const KEY_DOCUMENTS = "ire:documents"
const KEY_SEEDED = "ire:seeded_v4"

const delay = (ms = 40) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function seedIfNeeded() {
  if (typeof window === "undefined") return
  if (window.localStorage.getItem(KEY_SEEDED)) return
  writeJson(KEY_COMPANY, seedCompany())
  window.localStorage.setItem(KEY_SEEDED, "true")
}

export class LocalStorageRepository implements Repository {
  private seedReady: Promise<void>

  constructor() {
    this.seedReady = new Promise((resolve) => {
      if (typeof window === "undefined") return resolve()
      seedIfNeeded()
      resolve()
    })
  }

  private async ready() {
    await this.seedReady
  }

  async getCompany(): Promise<Company> {
    await this.ready()
    const stored = readJson<Company>(KEY_COMPANY)
    if (stored) return { ...seedCompany(), ...stored }
    const seeded = seedCompany()
    writeJson(KEY_COMPANY, seeded)
    return seeded
  }

  async saveCompany(company: Company): Promise<void> {
    await this.ready()
    writeJson(KEY_COMPANY, company)
  }

  async listClients(): Promise<Client[]> {
    await this.ready()
    return readJson<Client[]>(KEY_CLIENTS) ?? []
  }

  async getClient(id: string): Promise<Client | undefined> {
    await this.ready()
    const clients = readJson<Client[]>(KEY_CLIENTS) ?? []
    return clients.find((c) => c.id === id)
  }

  async saveClient(client: Client): Promise<void> {
    await this.ready()
    const clients = readJson<Client[]>(KEY_CLIENTS) ?? []
    const index = clients.findIndex((c) => c.id === client.id)
    if (index === -1) clients.push(client)
    else clients[index] = client
    writeJson(KEY_CLIENTS, clients)
    await delay()
  }

  async deleteClient(id: string): Promise<void> {
    await this.ready()
    const clients = readJson<Client[]>(KEY_CLIENTS) ?? []
    writeJson(KEY_CLIENTS, clients.filter((c) => c.id !== id))
    const docs = readJson<InvoiceDocument[]>(KEY_DOCUMENTS) ?? []
    writeJson(KEY_DOCUMENTS, docs.filter((d) => d.clientId !== id))
    await delay()
  }

  async listDocuments(): Promise<InvoiceDocument[]> {
    await this.ready()
    return readJson<InvoiceDocument[]>(KEY_DOCUMENTS) ?? []
  }

  async getDocument(id: string): Promise<InvoiceDocument | undefined> {
    await this.ready()
    const docs = readJson<InvoiceDocument[]>(KEY_DOCUMENTS) ?? []
    return docs.find((d) => d.id === id)
  }

  async saveDocument(doc: InvoiceDocument): Promise<void> {
    await this.ready()
    const docs = readJson<InvoiceDocument[]>(KEY_DOCUMENTS) ?? []
    const index = docs.findIndex((d) => d.id === doc.id)
    const updated = { ...doc, updatedAt: new Date().toISOString() }
    if (index === -1) docs.push(updated)
    else docs[index] = updated
    writeJson(KEY_DOCUMENTS, docs)
    await delay()
  }

  async deleteDocument(id: string): Promise<void> {
    await this.ready()
    const docs = readJson<InvoiceDocument[]>(KEY_DOCUMENTS) ?? []
    writeJson(KEY_DOCUMENTS, docs.filter((d) => d.id !== id))
    await delay()
  }
}
