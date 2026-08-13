"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils/cn"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md"

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong border border-accent",
  secondary:
    "bg-transparent text-ink hover:bg-ink/[0.04] border border-line-strong",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-ink/[0.04] border border-transparent",
  danger:
    "bg-transparent text-danger hover:bg-danger-soft border border-transparent",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] font-medium transition-colors select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}

interface LinkButtonProps {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  onClick?: () => void
  children: ReactNode
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] font-medium transition-colors select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Link>
  )
}
