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
import { HttpRepository } from "./http-repository"
import { useAuth } from "@/lib/auth/auth-context"
import { supabaseConfigured } from "@/lib/env"
import type { Client, Company, InvoiceDocument } from "./types"

const repo = supabaseConfigured ? new HttpRepository() : new LocalStorageRepository()

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
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [state, setState] = useState<{
    loadedFor: string | null
    company: Company | null
    clients: Client[]
    documents: InvoiceDocument[]
    error: string | null
  }>({ loadedFor: null, company: null, clients: [], documents: [], error: null })

  useEffect(() => {
    if (supabaseConfigured && !userId) return
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
          loadedFor: userId,
          company,
          clients,
          documents: documents.sort((a, b) => b.date.localeCompare(a.date)),
          error: null,
        })
      } catch (err) {
        if (!mounted) return
        if (supabaseConfigured && err instanceof Error && err.message === "Not signed in") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login"
          return
        }
        setState((prev) => ({ ...prev, error: err instanceof Error ? err.message : String(err) }))
      }
    })()
    return () => {
      mounted = false
    }
  }, [userId])

  const ready = supabaseConfigured
    ? Boolean(state.loadedFor) && state.loadedFor === userId
    : Boolean(state.loadedFor)

  const { company, clients, documents, error } = state

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
      ready,
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
    [ready, error, company, clients, documents, saveCompany, saveClient, deleteClient, saveDocument, deleteDocument],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within a DataProvider")
  return ctx
}
