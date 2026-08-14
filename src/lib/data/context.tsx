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
import { BrowserRepository } from "./local-repository"
import type { Client, Company, InvoiceDocument } from "./types"

const repo = new BrowserRepository()

interface DataContextValue {
  ready: boolean
  error: string | null
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
  const [state, setState] = useState<{
    loaded: boolean
    company: Company | null
    clients: Client[]
    documents: InvoiceDocument[]
    error: string | null
  }>({ loaded: false, company: null, clients: [], documents: [], error: null })

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const [company, clients, documents] = await Promise.all([
          repo.getCompany(),
          repo.listClients(),
          repo.listDocuments(),
        ])
        if (!mounted) return
        setState({
          loaded: true,
          company,
          clients,
          documents: documents.sort((a, b) => b.date.localeCompare(a.date)),
          error: null,
        })
      } catch (err) {
        if (!mounted) return
        setState({
          loaded: true,
          company: null,
          clients: [],
          documents: [],
          error: err instanceof Error ? err.message : String(err),
        })
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const { loaded, company, clients, documents, error } = state

  const saveCompany = useCallback(async (next: Company) => {
    await repo.saveCompany(next)
    setState((prev) => ({ ...prev, company: next }))
  }, [])

  const saveClient = useCallback(async (next: Client) => {
    await repo.saveClient(next)
    setState((prev) => {
      const index = prev.clients.findIndex((c) => c.id === next.id)
      const clients =
        index === -1 ? [next, ...prev.clients] : prev.clients.map((c, i) => (i === index ? next : c))
      return { ...prev, clients }
    })
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    await repo.deleteClient(id)
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== id),
      documents: prev.documents.filter((d) => d.clientId !== id),
    }))
  }, [])

  const saveDocument = useCallback(async (next: InvoiceDocument) => {
    await repo.saveDocument(next)
    setState((prev) => {
      const index = prev.documents.findIndex((d) => d.id === next.id)
      const documents =
        index === -1
          ? [next, ...prev.documents]
          : prev.documents.map((d, i) => (i === index ? next : d))
      return { ...prev, documents }
    })
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    await repo.deleteDocument(id)
    setState((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }))
  }, [])

  const value = useMemo(
    () => ({
      ready: loaded,
      error,
      company,
      clients,
      documents,
      saveCompany,
      saveClient,
      deleteClient,
      saveDocument,
      deleteDocument,
    }),
    [loaded, error, company, clients, documents, saveCompany, saveClient, deleteClient, saveDocument, deleteDocument],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within a DataProvider")
  return ctx
}
