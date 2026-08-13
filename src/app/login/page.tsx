"use client";

import { useAuth } from "@/lib/auth/auth-context";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginCard() {
  const { configured, loading, signInWithGoogle } = useAuth();
  const params = useSearchParams();
  const [starting, setStarting] = useState(false);
  const error = params.get("error");

  const start = async () => {
    setStarting(true);
    await signInWithGoogle();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-line bg-panel py-8 px-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/brand-mark.png"
            alt="Acre"
            width={48}
            height={48}
            className="size-12 rounded-[10px]"
          />
          <h1 className="mt-4 text-lg font-semibold tracking-tight text-ink">
            Acre
          </h1>
          <p className="mt-1 text-sm text-muted">
            Invoicing, acknowledgments and PDFs.
          </p>
        </div>

        {!configured ? (
          <div className="mt-6 rounded-lg border border-line bg-bg p-4 text-sm leading-relaxed text-muted">
            Supabase is not configured yet. Add{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-[12px] text-ink">
              NEXT_PUBLIC_SUPABASE_URL
            </code>
            ,{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-[12px] text-ink">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            </code>{" "}
            and{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-[12px] text-ink">
              SUPABASE_SECRET
            </code>{" "}
            to{" "}
            <code className="rounded bg-ink/5 px-1 py-0.5 text-[12px] text-ink">
              .env.local
            </code>
            .
          </div>
        ) : (
          <button
            type="button"
            onClick={start}
            disabled={loading || starting}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-line-strong bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/[0.03] disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.56-5.17 3.56-8.87Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
              />
            </svg>
            {loading
              ? "Checking session…"
              : starting
                ? "Redirecting…"
                : "Continue with Google"}
          </button>
        )}

        {error ? (
          <p className="mt-4 text-center text-sm text-red-600">
            Sign-in failed. Please try again.
          </p>
        ) : null}
        {params.get("deleted") ? (
          <p className="mt-4 text-center text-sm text-muted">
            Your account and all your data have been deleted.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginCard />
    </Suspense>
  );
}
