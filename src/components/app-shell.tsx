"use client";

import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <NavIcon>
        <rect x="3" y="3" width="5" height="5" rx="1.2" />
        <rect x="10" y="3" width="5" height="5" rx="1.2" />
        <rect x="3" y="10" width="5" height="5" rx="1.2" />
        <rect x="10" y="10" width="5" height="5" rx="1.2" />
      </NavIcon>
    ),
  },
  {
    href: "/documents",
    label: "Documents",
    icon: (
      <NavIcon>
        <path d="M6 2.5h4.5L14 6v9.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z" />
        <path d="M10 2.5V6h3.5" />
      </NavIcon>
    ),
  },
  {
    href: "/clients",
    label: "Clients",
    icon: (
      <NavIcon>
        <circle cx="6.5" cy="6" r="2.5" />
        <path d="M2.5 14.5c.6-2.2 2.2-3.5 4-3.5s3.4 1.3 4 3.5" />
        <circle cx="12.5" cy="7" r="2" />
        <path d="M11 11.4c1.5-.2 3 .6 3.8 2.3" />
      </NavIcon>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <NavIcon>
        <path d="M3 4.5h12" />
        <path d="M3 9h8" />
        <path d="M3 13.5h12" />
        <circle cx="12.5" cy="4.5" r="1.6" />
        <circle cx="13.5" cy="9" r="1.6" />
        <circle cx="11" cy="13.5" r="1.6" />
      </NavIcon>
    ),
  },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex h-16 items-center gap-2.5 px-5"
    >
      <Image
        src="/brand-mark.png"
        alt=""
        aria-hidden
        width={28}
        height={28}
        className="size-7 rounded-[7px]"
      />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-ink">
          Acre
        </span>
        <span className="block text-[11px] text-faint">Invoicing Letters</span>
      </span>
    </Link>
  );
}

function NavLinks({
  active,
  onNavigate,
}: {
  active: (href: string) => boolean;
  onNavigate?: () => void;
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
                "flex h-9 items-center gap-2.5 rounded-[6px] px-3 text-sm transition-colors",
                active(item.href)
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-muted hover:bg-ink/[0.04] hover:text-ink",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
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
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeLabel =
    navItems.find((item) => isActive(item.href))?.label ?? "Acre";

  const isEditor = /^\/documents\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand-mark.png"
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="size-7 rounded-[7px]"
          />
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Acre
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LinkButton href="/documents/new" size="sm">
            New
          </LinkButton>
        </div>
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
        className={cn(
          "print-hide fixed inset-0 z-40 lg:hidden",
          menuOpen ? "" : "pointer-events-none",
        )}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <NavLinks active={isActive} onNavigate={close} />
          <div className="border-t border-line p-3">
            <LinkButton
              href="/documents/new"
              size="md"
              className="w-full"
              onClick={close}
            >
              New document
            </LinkButton>
          </div>
          <SidebarFooter />
        </div>
      </div>

      <main className="lg:ml-56">
        <header className="print-hide sticky top-0 z-20 hidden h-14 items-center justify-between border-b border-line bg-panel px-6 lg:flex lg:px-10">
          <p className="text-sm font-medium text-ink">{activeLabel}</p>
        </header>
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
  );
}
