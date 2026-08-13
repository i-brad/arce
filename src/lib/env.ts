export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? ""
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY ?? ""
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY ?? ""

// Client-safe: auth + which repo to use only needs the public keys.
export const supabaseConfigured =
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_PUBLISHABLE_KEY)

export function imagekitConfigured(): boolean {
  return Boolean(IMAGEKIT_URL_ENDPOINT) && Boolean(IMAGEKIT_PUBLIC_KEY) && Boolean(IMAGEKIT_PRIVATE_KEY)
}
