"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/data/context"
import { ClientForm } from "@/components/clients/client-form"
import { PageHeader } from "@/components/ui/misc"

export default function EditClientPage({ params }: PageProps<"/clients/[id]">) {
  const { id } = use(params)
  const router = useRouter()
  const { ready, clients, saveClient } = useData()

  if (!ready) {
    return <p className="text-sm text-muted">Loading…</p>
  }

  const client = clients.find((c) => c.id === id)

  if (!client) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">Client not found.</p>
        <Link href="/clients" className="mt-2 inline-block text-[13px] font-medium text-accent">
          Back to clients
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Edit client" description={client.name} />
      <ClientForm
        initial={client}
        submitLabel="Save changes"
        onSubmit={async (next) => {
          await saveClient(next)
          router.push("/clients")
        }}
      />
    </div>
  )
}
