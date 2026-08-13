"use client"

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import type { ReactNode } from "react"
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
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline gap-1 text-[13px] font-medium text-ink">
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-muted">{hint}</span> : null}
    </label>
  )
}
