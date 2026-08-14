"use client"

import { useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

export function Dialog({
  open,
  onClose,
  title,
  description,
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  className?: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="print-hide fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center overflow-y-auto p-4 py-8 sm:py-14">
        <div
          className={cn(
            "relative w-full max-w-2xl rounded-[10px] border border-line bg-panel shadow-xl",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
              {description ? <p className="mt-0.5 text-[13px] text-muted">{description}</p> : null}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex size-8 shrink-0 items-center justify-center rounded-[7px] text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
