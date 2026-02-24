"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })

  if (error) return { error: error.message }

  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const adminKey = formData.get("adminKey") as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }

  const role = adminKey === process.env.ADMIN_SECRET_KEY ? "ADMIN" : "ASSOCIATE"

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user?.id,
    name,
    role,
  })

  if (profileError) return { error: profileError.message }

  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}