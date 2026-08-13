import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import { SUPABASE_URL } from "@/lib/env"

const SECRET = process.env.SUPABASE_SECRET ?? ""

let admin: SupabaseClient | null = null

export function createServerAdmin(): SupabaseClient {
  if (!SECRET) {
    throw new Error("SUPABASE_SECRET is not set. Add it to .env.local")
  }
  if (!admin) {
    admin = createClient(SUPABASE_URL, SECRET, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return admin
}
