"use client"

import { cloneElement, isValidElement, useId, type InputHTMLAttributes, type ReactElement, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils/cn"

const baseField =
  "w-full rounded-[6px] border border-line-strong bg-white px-3 text-sm text-ink " +
  "placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseField, "h-10", className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(baseField, "min-h-24 py-2.5 leading-relaxed", className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(baseField, "h-10 appearance-none pr-9 bg-no-repeat", className)} {...props} />
  )
}

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  const id = useId()
  // A Field is a group, not a single label: wrapping arbitrary children in a
  // <label> nests other labels (e.g. file upload buttons) and makes browsers
  // open the file dialog when clicking anywhere inside — including a signature
  // canvas. Use a <label htmlFor> for the caption instead and link it to the
  // control via the shared id.
  const singleControl = isValidElement(children)
  return (
    <div className={cn("block", className)}>
      <label
        htmlFor={singleControl ? id : undefined}
        className="mb-1.5 flex items-baseline gap-1 text-[13px] font-medium text-ink"
      >
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </label>
      {singleControl
        ? cloneElement(children as ReactElement<{ id?: string }>, { id })
        : children}
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-muted">{hint}</span> : null}
    </div>
  )
}
