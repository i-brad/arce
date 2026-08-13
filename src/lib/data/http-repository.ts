"use client"

import type { Client, Company, InvoiceDocument } from "./types"
import type { Repository } from "./repository"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/data${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const body = (await res.json().catch(() => null)) as {
    error?: string
    [key: string]: unknown
  } | null
  if (res.status === 401) throw new Error("Not signed in")
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
  return body as T
}

export class HttpRepository implements Repository {
  async getCompany(): Promise<Company> {
    const { company } = await request<{ company: Company }>("/company")
    return company
  }

  async saveCompany(company: Company): Promise<void> {
    await request("/company", { method: "POST", body: JSON.stringify({ company }) })
  }

  async listClients(): Promise<Client[]> {
    const { clients } = await request<{ clients: Client[] }>("/clients")
    return clients
  }

  async getClient(id: string): Promise<Client | undefined> {
    const { client } = await request<{ client?: Client }>(`/clients?id=${encodeURIComponent(id)}`)
    return client
  }

  async saveClient(client: Client): Promise<void> {
    await request("/clients", { method: "POST", body: JSON.stringify({ client }) })
  }

  async deleteClient(id: string): Promise<void> {
    await request(`/clients?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  }

  async listDocuments(): Promise<InvoiceDocument[]> {
    const { documents } = await request<{ documents: InvoiceDocument[] }>("/documents")
    return documents
  }

  async getDocument(id: string): Promise<InvoiceDocument | undefined> {
    const { document } = await request<{ document?: InvoiceDocument }>(`/documents?id=${encodeURIComponent(id)}`)
    return document
  }

  async saveDocument(doc: InvoiceDocument): Promise<void> {
    await request("/documents", { method: "POST", body: JSON.stringify({ document: doc }) })
  }

  async deleteDocument(id: string): Promise<void> {
    await request(`/documents?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  }
}
