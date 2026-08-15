"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data/context"
import type { Client, Company, InvoiceDocument } from "@/lib/data/types"
import { SettingsForm } from "@/app/(app)/settings/page"
import { DocumentEditor } from "@/components/document/document-editor"
import { DocumentPage } from "@/components/document/document-page"
import { PdfDownloadButton } from "@/components/document/pdf-download-button"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export default function DocumentEditorPage({ params }: PageProps<"/documents/[id]">) {
  const { id } = use(params)
  const { ready, documents, clients, company, saveDocument, deleteDocument, duplicateDocument } = useData()

  if (!ready || !company) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const stored = documents.find((d) => d.id === id)

  if (!stored) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">Document not found.</p>
        <Link href="/documents" className="mt-2 inline-block text-[13px] font-medium text-accent">
          Back to documents
        </Link>
      </div>
    )
  }

  return (
    <EditorInner
      key={stored.id}
      doc={stored}
      company={company}
      clients={clients}
      saveDocument={saveDocument}
      deleteDocument={deleteDocument}
      duplicateDocument={duplicateDocument}
    />
  )
}

function EditorInner({
  doc,
  company,
  clients,
  saveDocument,
  deleteDocument,
  duplicateDocument,
}: {
  doc: InvoiceDocument
  company: Company
  clients: Client[]
  saveDocument: (doc: InvoiceDocument) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  duplicateDocument: (id: string) => Promise<string | undefined>
}) {
  const router = useRouter()
  const { saveCompany } = useData()
  const [draft, setDraft] = useState(doc)
  const [saved, setSaved] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const client = clients.find((c) => c.id === draft.clientId)
  const fileName = `${draft.number || draft.title}${client ? ` - ${client.name}` : ""}.pdf`

  const save = async () => {
    await saveDocument(draft)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  const duplicate = async () => {
    setDuplicating(true)
    await saveDocument(draft)
    const newId = await duplicateDocument(draft.id)
    setDuplicating(false)
    if (newId) router.push(`/documents/${newId}`)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            ← Documents
          </Link>
          <span className="text-line-strong">/</span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ink">{draft.title}</p>
            <p className="text-[12px] text-muted">
              {draft.number || "No reference"} • {draft.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
            Settings
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="secondary" onClick={duplicate} disabled={duplicating}>
            {duplicating ? "Duplicating…" : "Duplicate"}
          </Button>
          <PdfDownloadButton doc={draft} company={company} client={client} fileName={fileName} />
          <Button onClick={save}>{saved ? "Saved" : "Save"}</Button>
          <Button
            variant="danger"
            onClick={() => {
              void deleteDocument(draft.id)
              router.push("/documents")
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
        description="Your company details appear on every document you send."
      >
        <SettingsForm company={company} saveCompany={saveCompany} />
      </Dialog>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <div className="print-hide min-w-0">
          <DocumentEditor doc={draft} clients={clients} onChange={setDraft} />
        </div>

        <div className="print-hide print-reset sticky top-8 self-start overflow-x-auto">
          <DocumentPage doc={draft} company={company} client={client} />
        </div>
      </div>

      <div className="print-only" aria-hidden>
        <DocumentPage doc={draft} company={company} client={client} />
      </div>
    </div>
  )
}
