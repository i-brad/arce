"use client"

import { useRouter } from "next/navigation"
import { useData } from "@/lib/data/context"
import { ClientForm } from "@/components/clients/client-form"
import { PageHeader } from "@/components/ui/misc"

export default function NewClientPage() {
  const router = useRouter()
  const { saveClient } = useData()

  return (
    <div>
      <PageHeader title="Add client" description="Create a client to send letters and invoices to." />
      <ClientForm
        submitLabel="Save client"
        onSubmit={async (client) => {
          await saveClient(client)
          router.push("/clients")
        }}
      />
    </div>
  )
}
