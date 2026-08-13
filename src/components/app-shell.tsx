"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils/cn"
import { LinkButton } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/clients", label: "Clients" },
  { href: "/settings", label: "Settings" },
]

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex h-16 items-center gap-2.5 px-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand-mark.png" alt="" aria-hidden className="size-7 rounded-[7px]" />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-ink">
          Acre
        </span>
        <span className="block text-[11px] text-faint">Real Estate Invoicing</span>
      </span>
    </Link>
  )
}

function NavLinks({
  active,
  onNavigate,
}: {
  active: (href: string) => boolean
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-0.5">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex h-9 items-center rounded-[6px] px-3 text-sm transition-colors",
                active(item.href)
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
  )
}

function SidebarFooter() {
  return (
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
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const isEditor = /^\/documents\/[^/]+$/.test(pathname)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="print-hide sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-panel px-4 lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex size-9 items-center justify-center rounded-[7px] text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand-mark.png" alt="" aria-hidden className="size-7 rounded-[7px]" />
          <span className="text-[15px] font-semibold tracking-tight text-ink">Acre</span>
        </Link>
        <LinkButton href="/documents/new" size="sm">
          New
        </LinkButton>
      </header>

      {/* Desktop sidebar */}
      <aside className="print-hide fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-line bg-panel lg:flex">
        <div className="border-b border-line">
          <Brand />
        </div>
        <NavLinks active={isActive} />
        <div className="border-t border-line p-3">
          <LinkButton href="/documents/new" size="md" className="w-full">
            New document
          </LinkButton>
        </div>
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn("print-hide fixed inset-0 z-40 lg:hidden", menuOpen ? "" : "pointer-events-none")}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/30 transition-opacity duration-200",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={close}
        />
        <div
          className={cn(
            "mobile-drawer absolute inset-y-0 left-0 flex w-64 max-w-[85vw] flex-col border-r border-line bg-panel shadow-xl transition-transform duration-200 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line">
            <Brand onClick={close} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="mr-3 flex size-8 items-center justify-center rounded-[7px] text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <NavLinks active={isActive} onNavigate={close} />
          <div className="border-t border-line p-3">
            <LinkButton href="/documents/new" size="md" className="w-full" onClick={close}>
              New document
            </LinkButton>
          </div>
          <SidebarFooter />
        </div>
      </div>

      <main className="lg:ml-56">
        <div
          className={cn(
            "mx-auto w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-10",
            isEditor ? "max-w-[1720px]" : "max-w-5xl",
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
