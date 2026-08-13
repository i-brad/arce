"use client"

import Link from "next/link"
import { useState } from "react"
import { useData } from "@/lib/data/context"
import { DOC_TYPE_LABELS } from "@/lib/data/types"
import { formatLetterDate } from "@/lib/documents/document-utils"
import { Badge, PageHeader } from "@/components/ui/misc"
import { Button, LinkButton } from "@/components/ui/button"
import { Input } from "@/components/ui/fields"

export default function DocumentsPage() {
  const { ready, documents, clients, deleteDocument } = useData()
  const [query, setQuery] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!ready) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const filtered = documents.filter((doc) => {
    if (!query.trim()) return true
    const client = clients.find((c) => c.id === doc.clientId)
    const q = query.toLowerCase()
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.number.toLowerCase().includes(q) ||
      (client ? client.name.toLowerCase().includes(q) : false)
    )
  })

  return (
    <div>
      <PageHeader
        title="Documents"
        description={`${documents.length} letters and invoices`}
        actions={<LinkButton href="/documents/new">New document</LinkButton>}
      />

      <div className="mb-5 max-w-sm">
        <Input
          placeholder="Search by title, reference or client…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-[10px] border border-line bg-panel">
        {filtered.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm text-muted">
              {documents.length === 0 ? "No documents yet." : "No documents match your search."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((doc) => {
              const client = clients.find((c) => c.id === doc.clientId)
              return (
                <li key={doc.id} className="flex items-center gap-4 px-5 py-3.5">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{doc.title}</p>
                      <p className="truncate text-[13px] text-muted">
                        {client ? client.name : "No client"} • {doc.number || "No ref"}
                      </p>
                    </div>
                    <span className="hidden w-32 text-[12px] text-faint sm:block">
                      {DOC_TYPE_LABELS[doc.type]}
                    </span>
                    <span className="hidden w-28 text-right text-[12px] tabular-nums text-faint md:block">
                      {formatLetterDate(doc.date)}
                    </span>
                    <Badge tone={doc.status === "sent" ? "sent" : "draft"}>{doc.status}</Badge>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmDelete(doc.id)}
                  >
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
            <h3 className="text-base font-semibold text-ink">Delete document?</h3>
            <p className="mt-1.5 text-sm text-muted">
              This cannot be undone. The letter and its details will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  void deleteDocument(confirmDelete)
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
