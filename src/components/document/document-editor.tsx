"use client"

import type { Client, DocFont, DocType, InvoiceDocument, ItemSection, LineItem } from "@/lib/data/types"
import { DOC_TYPE_LABELS } from "@/lib/data/types"
import { newLineItem } from "@/lib/documents/document-utils"
import { layoutLabels, templateList, type LayoutId, type TemplateId } from "@/lib/documents/theme"
import { uid } from "@/lib/utils/id"
import { Button } from "@/components/ui/button"
import { Field, Input, Select, Textarea } from "@/components/ui/fields"

interface DocumentEditorProps {
  doc: InvoiceDocument
  clients: Client[]
  onChange: (doc: InvoiceDocument) => void
}

function updateSection(
  doc: InvoiceDocument,
  sectionId: string,
  updater: (section: ItemSection) => ItemSection,
): InvoiceDocument {
  return {
    ...doc,
    sections: doc.sections.map((section) =>
      section.id === sectionId ? updater(section) : section,
    ),
  }
}

function updateItem(
  doc: InvoiceDocument,
  sectionId: string,
  itemId: string,
  updater: (item: LineItem) => LineItem,
): InvoiceDocument {
  return updateSection(doc, sectionId, (section) => ({
    ...section,
    items: section.items.map((item) => (item.id === itemId ? updater(item) : item)),
  }))
}

function removeSection(doc: InvoiceDocument, sectionId: string): InvoiceDocument {
  return { ...doc, sections: doc.sections.filter((s) => s.id !== sectionId) }
}

const layoutOrder: LayoutId[] = ["band", "classic", "banner"]

const templateGroups = layoutOrder
  .map((layout) => ({
    layout,
    label: layoutLabels[layout],
    templates: templateList.filter((tpl) => tpl.layout === layout),
  }))
  .filter((group) => group.templates.length > 0)

export function DocumentEditor({ doc, clients, onChange }: DocumentEditorProps) {
  const set = (patch: Partial<InvoiceDocument>) => onChange({ ...doc, ...patch })

  const addSection = () =>
    set({ sections: [...doc.sections, { id: uid("sec"), label: "", items: [newLineItem()] }] })

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <h2 className="border-b border-line pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Document
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <Select
              value={doc.type}
              onChange={(e) => set({ type: e.target.value as DocType })}
            >
              {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Reference number">
            <Input
              value={doc.number}
              onChange={(e) => set({ number: e.target.value })}
              placeholder="ACK-2026-001"
            />
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={doc.date}
              onChange={(e) => set({ date: e.target.value })}
            />
          </Field>
          <Field label="Client" required>
            <Select
              value={doc.clientId}
              onChange={(e) => set({ clientId: e.target.value })}
            >
              <option value="">Select client…</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Template" hint="Each template uses a different page layout, not just colours.">
            <Select
              value={doc.template}
              onChange={(e) => set({ template: e.target.value as TemplateId })}
            >
              {templateGroups.map((group) => (
                <optgroup key={group.layout} label={group.label}>
                  {group.templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Field>
          <Field label="Font">
            <Select
              value={doc.font ?? "carlito"}
              onChange={(e) => set({ font: e.target.value as DocFont })}
            >
              <option value="carlito">Carlito</option>
              <option value="fraunces">Fraunces</option>
            </Select>
          </Field>
          <Field label="Title">
            <Input
              value={doc.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="LETTER OF ACKNOWLEDGEMENT"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="border-b border-line pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Letter body
        </h2>

        <Field label="Salutation">
          <Input
            value={doc.salutation}
            onChange={(e) => set({ salutation: e.target.value })}
            placeholder="Dear Sir,"
          />
        </Field>

        <Field
          label="Opening paragraph"
          hint='Tokens: {amount} and {words} come from the first line item; {total} and {totalWords} come from all items.'
        >
          <Textarea
            className="min-h-36"
            value={doc.body}
            onChange={(e) => set({ body: e.target.value })}
          />
        </Field>

        <Field label="Breakdown heading">
          <Input
            value={doc.breakdownHeading}
            onChange={(e) => set({ breakdownHeading: e.target.value })}
            placeholder="The breakdown of the amount paid is as follows;"
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            Line items
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={addSection} type="button">
              + Section
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                set({
                  sections: [
                    ...doc.sections,
                    { id: uid("sec"), label: null, items: [newLineItem()] },
                  ],
                })
              }
            >
              + Items
            </Button>
          </div>
        </div>

        {doc.sections.map((section, sectionIndex) => (
          <div key={section.id} className="rounded-[8px] border border-line bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs text-faint">Section {sectionIndex + 1}</span>
              <Input
                className="h-8 flex-1"
                value={section.label ?? ""}
                placeholder="Section label (e.g. STATUTORY FEES)"
                onChange={(e) =>
                  onChange(
                    updateSection(doc, section.id, (s) => ({
                      ...s,
                      label: e.target.value.trim() === "" ? null : e.target.value,
                    })),
                  )
                }
              />
              {doc.sections.length > 1 ? (
                <Button
                  variant="danger"
                  size="sm"
                  type="button"
                  onClick={() => onChange(removeSection(doc, section.id))}
                >
                  Remove
                </Button>
              ) : null}
            </div>

            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <Input
                    className="flex-1"
                    value={item.description}
                    placeholder="Item description"
                    onChange={(e) =>
                      onChange(
                        updateItem(doc, section.id, item.id, (i) => ({
                          ...i,
                          description: e.target.value,
                        })),
                      )
                    }
                  />
                  <Input
                    className="w-36 text-right tabular-nums"
                    value={item.amount === 0 ? "" : String(item.amount)}
                    placeholder="0"
                    inputMode="numeric"
                    onChange={(e) => {
                      const parsed = Number(e.target.value.replace(/[^0-9.]/g, ""))
                      onChange(
                        updateItem(doc, section.id, item.id, (i) => ({
                          ...i,
                          amount: Number.isFinite(parsed) ? parsed : 0,
                        })),
                      )
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="shrink-0"
                    type="button"
                    disabled={section.items.length === 1}
                    onClick={() =>
                      onChange(
                        updateSection(doc, section.id, (s) => ({
                          ...s,
                          items: s.items.filter((i) => i.id !== item.id),
                        })),
                      )
                    }
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="mt-3"
              onClick={() =>
                onChange(
                  updateSection(doc, section.id, (s) => ({
                    ...s,
                    items: [...s.items, newLineItem()],
                  })),
                )
              }
            >
              + Add item
            </Button>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={doc.showTotal}
              onChange={(e) => set({ showTotal: e.target.checked })}
              className="size-4 accent-accent"
            />
            Show computed total at the end of the breakdown
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={doc.showPattern}
              onChange={(e) => set({ showPattern: e.target.checked })}
              className="size-4 accent-accent"
            />
            Show background pattern
          </label>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="border-b border-line pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Closing & signature
        </h2>

        <Field label="Closing paragraph">
          <Textarea
            className="min-h-24"
            value={doc.closing}
            onChange={(e) => set({ closing: e.target.value })}
          />
        </Field>

        <Field label="Thank-you line">
          <Textarea
            className="min-h-16"
            value={doc.thanks}
            onChange={(e) => set({ thanks: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Signatory role">
            <Input
              value={doc.signatoryRole}
              onChange={(e) => set({ signatoryRole: e.target.value })}
              placeholder="DIRECTOR OF OPERATIONS"
            />
          </Field>
          <Field label="Status">
            <Select
              value={doc.status}
              onChange={(e) => set({ status: e.target.value as InvoiceDocument["status"] })}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
            </Select>
          </Field>
        </div>
      </section>
    </div>
  )
}
