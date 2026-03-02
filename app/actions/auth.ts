"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { createClient as createAdminClient } from "@supabase/supabase-js"
// import { log } from "console"

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const adminKey = formData.get("adminKey") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return { error: error.message }

  const userId = data.user.id

  // 2. If admin key provided, validate and upgrade role
  if (adminKey && adminKey.trim() !== "") {
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      // Sign them out and reject
      await supabase.auth.signOut()
      return { error: "Invalid admin key." }
    }

    // Use service role client to bypass RLS for the update
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ role: "ADMIN" })
      .eq("id", userId)

    if (updateError) return { error: "Failed to upgrade role: " + updateError.message }

    return { success: true, redirect: "/dashboard/admin" }
  }

  return { success: true, redirect: "/dashboard" }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: name ?? "" },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`
    },
  })
  if (error) return { error: error.message }

  return { success: true, message: "Account created! Please log in." }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}