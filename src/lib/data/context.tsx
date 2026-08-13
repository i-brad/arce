"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { LocalStorageRepository } from "./local-storage-repository"
import type { Client, Company, InvoiceDocument } from "./types"

const repo = new LocalStorageRepository()

interface DataContextValue {
  ready: boolean
  company: Company | null
  clients: Client[]
  documents: InvoiceDocument[]
  saveCompany: (company: Company) => Promise<void>
  saveClient: (client: Client) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  saveDocument: (doc: InvoiceDocument) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [documents, setDocuments] = useState<InvoiceDocument[]>([])

  useEffect(() => {
    let mounted = true
    void (async () => {
      const [company, clients, documents] = await Promise.all([
        repo.getCompany(),
        repo.listClients(),
        repo.listDocuments(),
      ])
      if (!mounted) return
      setCompany(company)
      setClients(clients)
      setDocuments(documents.sort((a, b) => b.date.localeCompare(a.date)))
      setReady(true)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const saveCompany = useCallback(async (next: Company) => {
    await repo.saveCompany(next)
    setCompany(next)
  }, [])

  const saveClient = useCallback(async (next: Client) => {
    await repo.saveClient(next)
    setClients((prev) => {
      const index = prev.findIndex((c) => c.id === next.id)
      if (index === -1) return [next, ...prev]
      const copy = [...prev]
      copy[index] = next
      return copy
    })
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    await repo.deleteClient(id)
    setClients((prev) => prev.filter((c) => c.id !== id))
    setDocuments((prev) => prev.filter((d) => d.clientId !== id))
  }, [])

  const saveDocument = useCallback(async (next: InvoiceDocument) => {
    await repo.saveDocument(next)
    setDocuments((prev) => {
      const index = prev.findIndex((d) => d.id === next.id)
      if (index === -1) return [next, ...prev]
      const copy = [...prev]
      copy[index] = next
      return copy
    })
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    await repo.deleteDocument(id)
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      ready,
      company,
      clients,
      documents,
      saveCompany,
      saveClient,
      deleteClient,
      saveDocument,
      deleteDocument,
    }),
    [ready, company, clients, documents, saveCompany, saveClient, deleteClient, saveDocument, deleteDocument],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within a DataProvider")
  return ctx
}
