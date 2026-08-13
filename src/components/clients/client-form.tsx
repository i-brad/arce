"use client"

import { useState } from "react"
import type { Client } from "@/lib/data/types"
import { uid } from "@/lib/utils/id"
import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/fields"

interface ClientFormProps {
  initial?: Client
  submitLabel: string
  onSubmit: (client: Client) => Promise<void> | void
}

export function ClientForm({ initial, submitLabel, onSubmit }: ClientFormProps) {
  const [form, setForm] = useState<Client>(
    initial ?? {
      id: uid("client"),
      name: "",
      address: "",
      phone: "",
      email: "",
      createdAt: new Date().toISOString(),
    },
  )
  const [saving, setSaving] = useState(false)

  const set = (patch: Partial<Client>) => setForm((prev) => ({ ...prev, ...patch }))

  const submit = async () => {
    setSaving(true)
    try {
      await onSubmit(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-5 rounded-[10px] border border-line bg-panel p-6">
      <Field label="Full name" required>
        <Input
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="MR JOHN DOE"
        />
      </Field>
      <Field label="Address">
        <Input
          value={form.address}
          onChange={(e) => set({ address: e.target.value })}
          placeholder="NO 1, STREET, CITY, STATE."
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="+234…"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="client@example.com"
          />
        </Field>
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={submit} disabled={saving || !form.name.trim()}>
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  )
}
