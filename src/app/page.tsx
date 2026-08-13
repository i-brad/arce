"use client"

import Link from "next/link"
import { useData } from "@/lib/data/context"
import { DOC_TYPE_LABELS } from "@/lib/data/types"
import { formatLetterDate } from "@/lib/documents/document-utils"
import { Badge, PageHeader } from "@/components/ui/misc"
import { LinkButton } from "@/components/ui/button"

export default function DashboardPage() {
  const { ready, documents, clients, company } = useData()

  if (!ready) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const drafts = documents.filter((d) => d.status === "draft").length
  const recent = documents.slice(0, 6)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your letters and invoices"
        actions={<LinkButton href="/documents/new">New document</LinkButton>}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Documents" value={documents.length} href="/documents" />
        <Stat label="Drafts" value={drafts} href="/documents" />
        <Stat label="Clients" value={clients.length} href="/clients" />
      </div>

      <div className="overflow-hidden rounded-[10px] border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Recent documents</h2>
          <Link
            href="/documents"
            className="text-[13px] font-medium text-accent hover:text-accent-strong"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm text-muted">No documents yet.</p>
            <p className="mt-1 text-[13px] text-faint">
              Create your first letter or invoice to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((doc) => {
              const client = clients.find((c) => c.id === doc.clientId)
              return (
                <li key={doc.id}>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-bg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{doc.title}</p>
                      <p className="truncate text-[13px] text-muted">
                        {client ? client.name : "No client"}
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
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {company && clients.length === 0 ? (
        <div className="mt-6 rounded-[10px] border border-dashed border-line-strong bg-panel/60 px-5 py-6 text-sm text-muted">
          No clients yet.{" "}
          <Link href="/clients/new" className="font-medium text-accent">
            Add your first client
          </Link>{" "}
          to start sending letters.
        </div>
      ) : null}
    </div>
  )
}

function Stat({
  label,
  value,
  href,
}: {
  label: string
  value: number
  href: string
}) {
  return (
    <Link
      href={href}
      className="rounded-[10px] border border-line bg-panel px-5 py-4 transition-colors hover:bg-bg"
    >
      <p className="text-2xl font-semibold tabular-nums tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-[13px] text-muted">{label}</p>
    </Link>
  )
}
