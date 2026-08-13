import { cn } from "@/lib/utils/cn"

const tones = {
  draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
  sent: "bg-accent-soft text-accent border-accent/20",
  default: "bg-bg text-muted border-line",
} as const

export function Badge({
  tone = "default",
  className,
  children,
}: {
  tone?: keyof typeof tones
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
