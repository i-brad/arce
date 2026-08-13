"use client"

import { useState } from "react"
import { useData } from "@/lib/data/context"
import type { Company } from "@/lib/data/types"
import { templateList, type TemplateId } from "@/lib/documents/theme"
import { SignaturePad } from "@/components/settings/signature-pad"
import { PageHeader } from "@/components/ui/misc"
import { Button } from "@/components/ui/button"
import { Field, Input, Select } from "@/components/ui/fields"

export default function SettingsPage() {
  const { ready, company, saveCompany } = useData()

  if (!ready || !company) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  return (
    <SettingsForm company={company} saveCompany={saveCompany} />
  )
}

function SettingsForm({
  company,
  saveCompany,
}: {
  company: Company
  saveCompany: (company: Company) => Promise<void>
}) {
  const [form, setForm] = useState<Company>(company)
  const [saved, setSaved] = useState(false)
  const [showPad, setShowPad] = useState(false)

  const set = (patch: Partial<Company>) => setForm((prev) => ({ ...prev, ...patch }))

  const save = async () => {
    await saveCompany(form)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Settings"
        description="Your company details appear on every document you send."
      />

      <div className="space-y-5 rounded-[10px] border border-line bg-panel p-6">
        <Field label="Company name" required>
          <Input
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Silver Pacific Homes"
          />
        </Field>

        <Field
          label="Logo"
          hint="PNG, JPEG or WebP. Appears at the top of every document and PDF."
        >
          <div className="flex items-center gap-4">
            {form.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logo}
                alt="Company logo"
                className="size-14 rounded-[6px] border border-line bg-white object-contain p-1"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-[6px] border border-dashed border-line-strong text-[11px] text-faint">
                None
              </div>
            )}
            <label className="inline-flex h-10 cursor-pointer items-center rounded-[6px] border border-line-strong px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/[0.04]">
              {form.logo ? "Replace logo" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => set({ logo: String(reader.result ?? "") })
                  reader.readAsDataURL(file)
                  e.target.value = ""
                }}
              />
            </label>
            {form.logo ? (
              <Button variant="ghost" size="md" type="button" onClick={() => set({ logo: "" })}>
                Remove
              </Button>
            ) : null}
          </div>
        </Field>

        <Field label="Address">
          <Input
            value={form.address}
            onChange={(e) => set({ address: e.target.value })}
            placeholder="Estate, City, State"
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
              placeholder="office@company.com"
            />
          </Field>
        </div>
        <Field label="WhatsApp" hint="Shown alongside your other contacts on the document.">
          <Input
            value={form.whatsapp}
            onChange={(e) => set({ whatsapp: e.target.value })}
            placeholder="+234…"
          />
        </Field>

        <div className="border-t border-line pt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            Socials
          </h3>
          <p className="mb-4 mt-1 text-xs text-muted">
            Contact details and socials are rendered in the footer of every document and PDF.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Website">
              <Input
                value={form.website}
                onChange={(e) => set({ website: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            <Field label="Instagram">
              <Input
                value={form.instagram}
                onChange={(e) => set({ instagram: e.target.value })}
                placeholder="@handle"
              />
            </Field>
            <Field label="Facebook">
              <Input
                value={form.facebook}
                onChange={(e) => set({ facebook: e.target.value })}
                placeholder="Page name"
              />
            </Field>
            <Field label="X (Twitter)">
              <Input
                value={form.twitter}
                onChange={(e) => set({ twitter: e.target.value })}
                placeholder="@handle"
              />
            </Field>
            <Field label="TikTok">
              <Input
                value={form.tiktok}
                onChange={(e) => set({ tiktok: e.target.value })}
                placeholder="@handle"
              />
            </Field>
            <Field label="LinkedIn">
              <Input
                value={form.linkedin}
                onChange={(e) => set({ linkedin: e.target.value })}
                placeholder="Company page URL"
              />
            </Field>
          </div>
        </div>

        <Field label="Registration number">
          <Input
            value={form.regNo}
            onChange={(e) => set({ regNo: e.target.value })}
            placeholder="e.g. 1234567"
          />
        </Field>
        <Field
          label="Default template"
          hint="Used for new documents. You can switch templates per document in the editor."
        >
          <Select
            value={form.defaultTemplate}
            onChange={(e) => set({ defaultTemplate: e.target.value as TemplateId })}
          >
            {templateList.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Default signatory role">
            <Input
              value={form.signatoryRole}
              onChange={(e) => set({ signatoryRole: e.target.value })}
              placeholder="DIRECTOR OF OPERATIONS"
            />
          </Field>
          <Field label="Signatory name">
            <Input
              value={form.signatoryName}
              onChange={(e) => set({ signatoryName: e.target.value })}
              placeholder="Full name"
            />
          </Field>
        </div>

        <Field
          label="Signature"
          hint="Shown above the signature line on every document and PDF. PNG with a transparent background looks best."
        >
          <div className="flex flex-wrap items-center gap-4">
            {form.signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.signature}
                alt="Signature preview"
                className="h-16 rounded-[6px] border border-line bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-16 w-44 items-center justify-center rounded-[6px] border border-dashed border-line-strong text-[11px] text-faint">
                None
              </div>
            )}
            <label className="inline-flex h-10 cursor-pointer items-center rounded-[6px] border border-line-strong px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/[0.04]">
              Upload
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => set({ signature: String(reader.result ?? "") })
                  reader.readAsDataURL(file)
                  e.target.value = ""
                }}
              />
            </label>
            <Button variant="secondary" type="button" onClick={() => setShowPad(true)}>
              {form.signature ? "Redraw" : "Draw"}
            </Button>
            {form.signature ? (
              <Button variant="ghost" type="button" onClick={() => set({ signature: "" })}>
                Remove
              </Button>
            ) : null}
          </div>
          {showPad ? (
            <div className="mt-3 rounded-[8px] border border-line p-4">
              <p className="mb-2 text-[13px] text-muted">
                Draw your signature in the box below.
              </p>
              <SignaturePad
                onCancel={() => setShowPad(false)}
                onSave={(dataUrl) => {
                  set({ signature: dataUrl })
                  setShowPad(false)
                }}
              />
            </div>
          ) : null}
        </Field>
        <div className="flex justify-end pt-2">
          <Button onClick={save}>{saved ? "Saved" : "Save settings"}</Button>
        </div>
      </div>
    </div>
  )
}
