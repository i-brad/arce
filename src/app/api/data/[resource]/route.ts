import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createServerAdmin } from "@/lib/supabase/admin"
import {
  mapClient,
  mapCompany,
  mapDocument,
  toClientRow,
  toCompanyRow,
  toDocumentRow,
  type ClientRow,
  type CompanyRow,
  type DocumentRow,
} from "@/lib/data/supabase-mappers"
import { seedCompany } from "@/lib/data/seed"
import type { Client, Company, InvoiceDocument } from "@/lib/data/types"

export const dynamic = "force-dynamic"

const RESOURCES = ["company", "clients", "documents"] as const

async function getUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

async function seedAccount(admin: SupabaseClient, userId: string): Promise<Company> {
  const company = seedCompany()

  const { data: insertedCompany, error: companyError } = await admin
    .from("companies")
    .insert(toCompanyRow(userId, company))
    .select()
    .single()
  if (companyError) throw companyError

  return mapCompany(insertedCompany as CompanyRow)
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params
  if (!(RESOURCES as readonly string[]).includes(resource)) {
    return json({ error: `Unknown resource: ${resource}` }, 400)
  }
  const userId = await getUserId()
  if (!userId) return json({ error: "Not signed in" }, 401)
  const admin = createServerAdmin()
  const id = request.nextUrl.searchParams.get("id")

  if (resource === "company") {
    const { data, error } = await admin
      .from("companies")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
    if (error) return json({ error: error.message }, 500)
    if (!data) {
      try {
        const seeded = await seedAccount(admin, userId)
        return json({ company: seeded })
      } catch (seedError) {
        return json({ error: seedError instanceof Error ? seedError.message : String(seedError) }, 500)
      }
    }
    return json({ company: mapCompany(data as CompanyRow) })
  }

  const table = resource as "clients" | "documents"
  if (id) {
    const query = table === "clients"
      ? admin.from("clients").select("*").eq("id", id).eq("user_id", userId).maybeSingle()
      : admin.from("documents").select("*").eq("id", id).eq("user_id", userId).maybeSingle()
    const { data, error } = await query
    if (error) return json({ error: error.message }, 500)
    return json(table === "clients"
      ? { client: data ? mapClient(data as ClientRow) : undefined }
      : { document: data ? mapDocument(data as DocumentRow) : undefined })
  }

  const query = table === "clients"
    ? admin.from("clients").select("*").eq("user_id", userId).order("created_at", { ascending: false })
    : admin.from("documents").select("*").eq("user_id", userId).order("date", { ascending: false })
  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)
  return json(table === "clients"
    ? { clients: (data as ClientRow[]).map(mapClient) }
    : { documents: (data as DocumentRow[]).map(mapDocument) })
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params
  if (!(RESOURCES as readonly string[]).includes(resource)) {
    return json({ error: `Unknown resource: ${resource}` }, 400)
  }
  const userId = await getUserId()
  if (!userId) return json({ error: "Not signed in" }, 401)
  const admin = createServerAdmin()

  const body = await request.json().catch(() => null)

  if (resource === "company") {
    const company = body?.company as Company | undefined
    if (!company) return json({ error: "Missing company" }, 400)
    const { error } = await admin.from("companies").update(toCompanyRow(userId, company)).eq("user_id", userId)
    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  }

  if (resource === "clients") {
    const client = body?.client as Client | undefined
    if (!client) return json({ error: "Missing client" }, 400)
    const { data: existing } = await admin
      .from("clients")
      .select("id")
      .eq("id", client.id)
      .eq("user_id", userId)
      .maybeSingle()
    const row = { ...toClientRow(userId, client), id: client.id }
    const { error } = existing
      ? await admin.from("clients").update(row).eq("id", client.id).eq("user_id", userId)
      : await admin.from("clients").insert(row)
    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  }

  const doc = body?.document as InvoiceDocument | undefined
  if (!doc) return json({ error: "Missing document" }, 400)
  const { data: existing } = await admin
    .from("documents")
    .select("id")
    .eq("id", doc.id)
    .eq("user_id", userId)
    .maybeSingle()
  const row = {
    ...toDocumentRow(userId, doc),
    id: doc.id,
    updated_at: new Date().toISOString(),
  }
  const { error } = existing
    ? await admin.from("documents").update(row).eq("id", doc.id).eq("user_id", userId)
    : await admin.from("documents").insert(row)
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params
  if (!(RESOURCES as readonly string[]).includes(resource)) {
    return json({ error: `Unknown resource: ${resource}` }, 400)
  }
  if (resource === "company") {
    return json({ error: "Cannot delete company" }, 400)
  }
  const userId = await getUserId()
  if (!userId) return json({ error: "Not signed in" }, 401)
  const admin = createServerAdmin()
  const id = request.nextUrl.searchParams.get("id")
  if (!id) return json({ error: "Missing id" }, 400)

  const query = resource === "clients"
    ? admin.from("clients").delete().eq("id", id).eq("user_id", userId)
    : admin.from("documents").delete().eq("id", id).eq("user_id", userId)
  const { error } = await query
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}
