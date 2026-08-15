"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data/context"
import { DOC_TYPE_LABELS, type DocType } from "@/lib/data/types"
import { newDocument, today } from "@/lib/documents/document-utils"
import { suggestRefNumber } from "@/lib/documents/ref-number"
import {
  SAMPLE_DOCS,
  sampleDocument,
} from "@/lib/documents/sample-documents"
import { PageHeader } from "@/components/ui/misc"
import { Button } from "@/components/ui/button"
import { Field, Input, Select } from "@/components/ui/fields"

export default function NewDocumentPage() {
  const router = useRouter()
  const { ready, clients, documents, company, saveDocument } = useData()

  const [type, setType] = useState<DocType>("acknowledgement")
  const [clientId, setClientId] = useState("")
  const [date, setDate] = useState(today())
  const [phase, setPhase] = useState("PH1")
  const [number, setNumber] = useState("")
  const [saving, setSaving] = useState(false)

  if (!ready || !company) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const create = async () => {
    if (!company) return
    const doc = newDocument(type, company)
    doc.clientId = clientId
    doc.date = date
    doc.phase = phase
    doc.number = number.trim() || suggestRefNumber(documents, company, phase, date)
    setSaving(true)
    await saveDocument(doc)
    router.push(`/documents/${doc.id}`)
  }

  const loadSample = async (sampleType: DocType) => {
    if (!company) return
    setSaving(true)
    const doc = sampleDocument(sampleType, company)
    await saveDocument(doc)
    router.push(`/documents/${doc.id}`)
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="New document"
        description="Start from a sample or build a letter from scratch in the editor."
      />

      <div className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-ink">Start from a sample</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLE_DOCS.map((sample) => (
            <button
              key={sample.key}
              type="button"
              disabled={saving}
              onClick={() => void loadSample(sample.type)}
              className="group rounded-[10px] border border-line bg-panel p-5 text-left transition hover:border-accent/50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                {DOC_TYPE_LABELS[sample.type]}
              </p>
              <p className="mt-1.5 text-sm font-medium text-ink">{sample.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-faint">or build from scratch</span>
        <div className="h-px flex-1 bg-line" />
      </div>

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

        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>

        <Field label="Phase / property" hint="Feeds the reference number, e.g. PH1.">
          <Input value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="PH1" />
        </Field>

        <Field label="Reference number" hint="Leave blank to auto-generate from the company, phase, date and sequence.">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="CK-PH1-2026-001"
            />
            <Button
              variant="secondary"
              type="button"
              onClick={() => setNumber(suggestRefNumber(documents, company, phase, date))}
            >
              Suggest
            </Button>
          </div>
        </Field>

        <div className="flex justify-end pt-2">
          <Button onClick={create} disabled={saving || !clientId}>
            {saving ? "Creating…" : "Create & edit"}
          </Button>
        </div>
      </div>
    </div>
  )
}
