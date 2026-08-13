"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"
import { LinkButton } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/clients", label: "Clients" },
  { href: "/settings", label: "Settings" },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const isEditor = /^\/documents\/[^/]+$/.test(pathname)

  return (
    <div className="flex min-h-screen">
      <aside className="print-hide fixed inset-y-0 left-0 z-20 flex w-56 flex-col border-r border-line bg-panel">
        <Link
          href="/"
          className="flex h-16 items-center gap-2.5 border-b border-line px-5"
        >
          <span className="flex size-7 items-center justify-center rounded-[7px] bg-accent text-[13px] font-semibold text-white">
            A
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight text-ink">
              Acre
            </span>
            <span className="block text-[11px] text-faint">Real Estate Invoicing</span>
          </span>
        </Link>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center rounded-[6px] px-3 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-muted hover:bg-ink/[0.04] hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line p-3">
          <LinkButton href="/documents/new" size="md" className="w-full">
            New document
          </LinkButton>
        </div>

        <div className="border-t border-line px-5 py-3 text-[11px] leading-relaxed text-faint">
          <p>&copy; {new Date().getFullYear()} Acre</p>
          <p>
            Built by{" "}
            <a
              href="https://worksbybrad.xyz"
              target="_blank"
              rel="noreferrer"
              className="text-muted underline decoration-ink/20 underline-offset-2 hover:text-accent"
            >
              worksbybrad.xyz
            </a>
          </p>
        </div>
      </aside>

      <main className="ml-56 flex-1">
        <div
          className={cn(
            "mx-auto w-full px-10 py-10",
            isEditor ? "max-w-[1720px]" : "max-w-5xl",
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
