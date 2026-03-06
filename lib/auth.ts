import { cache } from "react"
import { createClient } from "./supabase/server"
import { redirect } from "next/navigation"

export const  getUserWithRole = cache(async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/login")
  }

  return { user, profile, email: user.email }
})

// export async function requireAdmin() {
//   const supabase = await createClient()

//   const {fi
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/login")
//   }

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("id, role, name, email")
//     .eq("id", user.id)
//     .single()

//   if (!profile || profile.role !== "ADMIN") {
//     redirect("/dashboard")
//   }

//   return { user, profile }
// }

export async function requireAdmin() {
  const supabase = await createClient()
  const { user, profile } = await getUserWithRole()

  if (profile.role !== "ADMIN") redirect("/dashboard")

  return { supabase, user, profile } // include supabase for queries
}