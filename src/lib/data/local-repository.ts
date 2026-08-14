"use client"

import type { Client, Company, InvoiceDocument } from "./types"
import { seedCompany } from "./seed"
import type { Repository } from "./repository"

const DB_NAME = "acre"
const DB_VERSION = 1
const STORE = "kv"

const KEYS = {
  company: "company",
  clients: "clients",
  documents: "documents",
} as const

/**
 * Everything lives in the browser — no server, no database, no accounts.
 * Structured data (company, clients, documents) is stored in IndexedDB so
 * uploaded images fit without hitting localStorage's ~5MB cap.
 */
export class BrowserRepository implements Repository {
  private memory: Record<string, unknown> = {}

  private async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await idbGet(key)
      if (value !== undefined) return value as T
    } catch {
      // fall through to in-memory copy
    }
    return this.memory[key] as T | undefined
  }

  private async set(key: string, value: unknown): Promise<void> {
    this.memory[key] = value
    try {
      await idbSet(key, value)
    } catch {
      // IndexedDB unavailable (private mode, storage disabled) — memory only.
    }
  }

  async getCompany(): Promise<Company> {
    const stored = await this.get<Partial<Company>>(KEYS.company)
    if (!stored) return seedCompany()
    return { ...seedCompany(), ...stored }
  }

  async saveCompany(company: Company): Promise<void> {
    await this.set(KEYS.company, company)
  }

  async listClients(): Promise<Client[]> {
    return (await this.get<Client[]>(KEYS.clients)) ?? []
  }

  async getClient(id: string): Promise<Client | undefined> {
    const clients = await this.listClients()
    return clients.find((c) => c.id === id)
  }

  async saveClient(client: Client): Promise<void> {
    const clients = await this.listClients()
    const index = clients.findIndex((c) => c.id === client.id)
    if (index === -1) clients.push(client)
    else clients[index] = client
    await this.set(KEYS.clients, clients)
  }

  async deleteClient(id: string): Promise<void> {
    const clients = await this.listClients()
    await this.set(KEYS.clients, clients.filter((c) => c.id !== id))
    const documents = await this.listDocuments()
    await this.set(KEYS.documents, documents.filter((d) => d.clientId !== id))
  }

  async listDocuments(): Promise<InvoiceDocument[]> {
    return (await this.get<InvoiceDocument[]>(KEYS.documents)) ?? []
  }

  async getDocument(id: string): Promise<InvoiceDocument | undefined> {
    const documents = await this.listDocuments()
    return documents.find((d) => d.id === id)
  }

  async saveDocument(doc: InvoiceDocument): Promise<void> {
    const documents = await this.listDocuments()
    const index = documents.findIndex((d) => d.id === doc.id)
    const updated = { ...doc, updatedAt: new Date().toISOString() }
    if (index === -1) documents.push(updated)
    else documents[index] = updated
    await this.set(KEYS.documents, documents)
  }

  async deleteDocument(id: string): Promise<void> {
    const documents = await this.listDocuments()
    await this.set(KEYS.documents, documents.filter((d) => d.id !== id))
  }
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      dbPromise = null
      reject(request.error ?? new Error("IndexedDB unavailable"))
    }
  })
  return dbPromise
}

function idbGet(key: string): Promise<unknown> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly")
        const request = tx.objectStore(STORE).get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }),
  )
}

function idbSet(key: string, value: unknown): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite")
        tx.objectStore(STORE).put(value, key)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error ?? new Error("IndexedDB write aborted"))
      }),
  )
}
