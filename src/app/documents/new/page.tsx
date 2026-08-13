"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data/context"
import { DOC_TYPE_LABELS, type DocType } from "@/lib/data/types"
import { newDocument, today } from "@/lib/documents/document-utils"
import { PageHeader } from "@/components/ui/misc"
import { Button } from "@/components/ui/button"
import { Field, Input, Select } from "@/components/ui/fields"

export default function NewDocumentPage() {
  const router = useRouter()
  const { ready, clients, company, saveDocument } = useData()

  const [type, setType] = useState<DocType>("acknowledgement")
  const [clientId, setClientId] = useState("")
  const [number, setNumber] = useState("")
  const [date, setDate] = useState(today())
  const [saving, setSaving] = useState(false)

  if (!ready || !company) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const create = async () => {
    if (!company) return
    const doc = newDocument(type, company)
    doc.clientId = clientId
    doc.number = number.trim()
    doc.date = date
    setSaving(true)
    await saveDocument(doc)
    router.push(`/documents/${doc.id}`)
  }

  return (
    <div className="max-w-lg">
      <PageHeader
        title="New document"
        description="Choose the type and recipient, then build the letter in the editor."
      />

      <div className="space-y-5 rounded-[10px] border border-line bg-panel p-6">
        <Field label="Type" required>
          <Select value={type} onChange={(e) => setType(e.target.value as DocType)}>
            {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Client" required hint="Add clients from the Clients page if none are listed.">
          <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Select client…</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Reference number">
            <Input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={`${type === "invoice" ? "INV" : "ACK"}-2026-001`}
            />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={create} disabled={saving || !clientId}>
            {saving ? "Creating…" : "Create & edit"}
          </Button>
        </div>
      </div>
    </div>
  )
}
