"use client"

import Link from "next/link"
import { useState } from "react"
import { useData } from "@/lib/data/context"
import { PageHeader } from "@/components/ui/misc"
import { Button, LinkButton } from "@/components/ui/button"
import { Input } from "@/components/ui/fields"

export default function ClientsPage() {
  const { ready, clients, documents, deleteClient } = useData()
  const [query, setQuery] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!ready) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const filtered = clients.filter((client) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return client.name.toLowerCase().includes(q) || client.address.toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${clients.length} clients`}
        actions={<LinkButton href="/clients/new">Add client</LinkButton>}
      />

      <div className="mb-5 max-w-sm">
        <Input
          placeholder="Search clients…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-[10px] border border-line bg-panel">
        {filtered.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm text-muted">
              {clients.length === 0 ? "No clients yet." : "No clients match your search."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((client) => {
              const count = documents.filter((d) => d.clientId === client.id).length
              return (
                <li key={client.id} className="flex items-center gap-4 px-5 py-3.5">
                  <Link href={`/clients/${client.id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{client.name}</p>
                    <p className="truncate text-[13px] text-muted">{client.address}</p>
                    {client.phone || client.email ? (
                      <p className="truncate text-[12px] text-faint">
                        {[client.phone, client.email].filter(Boolean).join(" • ")}
                      </p>
                    ) : null}
                  </Link>
                  <span className="shrink-0 text-[12px] tabular-nums text-faint">
                    {count} document{count === 1 ? "" : "s"}
                  </span>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(client.id)}>
                    Delete
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4">
          <div className="w-full max-w-sm rounded-[10px] border border-line bg-panel p-6">
            <h3 className="text-base font-semibold text-ink">Delete client?</h3>
            <p className="mt-1.5 text-sm text-muted">
              This also deletes every document belonging to this client.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  void deleteClient(confirmDelete)
                  setConfirmDelete(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
