import { createClient, SupabaseClient } from "@supabase/supabase-js"

export const supabaseServer = (access_token?: string): SupabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY

  if (!url || !key) {
    throw new Error("Missing SUPABASE URL/KEY environment variables")
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      headers: access_token ? { Authorization: `Bearer ${access_token}` } : undefined,
    },
  })
}