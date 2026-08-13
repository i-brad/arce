import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerAdmin } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 })
  }

  const admin = createServerAdmin()

  // Deleting the auth user cascades to all their rows (companies, clients,
  // documents) via the foreign keys that reference auth.users.
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
