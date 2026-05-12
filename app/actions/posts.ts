"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { transporter } from "@/lib/mailer"
import { supabaseAdmin } from "@/lib/supabase/admin"
// import { createClient } from "@supabase/ssr"


// export async function createUser(formData: FormData) {
//   const profile = await getUserWithRole()

//   if (!profile || profile.role !== "ADMIN") {
//     return { error: "Unauthorized" }
//   }

//   const email = formData.get("email") as string
//   const password = formData.get("password") as string
//   const name = formData.get("name") as string
//   const role = formData.get("role") as "ADMIN" | "ASSOCIATE"

//   const adminClient = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
//     {
//       cookies: {
//         getAll: () => [],
//         setAll: () => { },
//       },
//     }
//   )

//   // 1️⃣ Create Auth User
//   const { data, error } = await adminClient.auth.admin.createUser({
//     email,
//     password,
//     email_confirm: true,
//   })

//   if (error) return { error: error.message }

//   // 2️⃣ Insert Profile
//   const { error: profileError } = await adminClient
//     .from("profiles")
//     .insert({
//       id: data.user.id,
//       name,
//       role,
//     })

//   if (profileError) return { error: profileError.message }

//   revalidatePath("/dashboard")
//   return { success: true }
// }

// export async function inviteUser(formData: FormData) {
//   const { profile } = await getUserWithRole()

//   if (!profile || profile.role !== "ADMIN") {
//     return { error: "Unauthorized" }
//   }

//   const email = formData.get("email") as string
//   const name = formData.get("name") as string
//   const role = formData.get("role") as "ADMIN" | "ASSOCIATE"

//   const adminClient = await createClient()

//   // 1️⃣ Send Invite
//   const { data, error } = await adminClient.auth.admin.inviteUserByEmail(
//     email,
//     {
//       redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/set-password`,
//     }
//   )

//   if (error) return { error: error.message }

//   if (!data.user) {
//     return { error: "User creation failed" }
//   }

//   // 2️⃣ Create Profile
//   const { error: profileError } = await adminClient
//     .from("profiles")
//     .insert({ id: data.user.id, name, role })
//   if (profileError) return { error: profileError.message }

//   revalidatePath("/dashboard")
//   return { success: true, message: "Invite sent successfully" }
// }

export async function getPosts() {
  const supabase = await createClient()
  const { profile } = await getUserWithRole()
  if (!profile) return { error: "Unauthorized" }

  if (profile.role === "ADMIN") {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        post_actions (
          id,
          delivery_note,
          liked,
          created_at,
          updated_at,
          user_id,
          profiles (name)
        ),
        post_assignments (
          user_id,
          profiles (name)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) return { error: error.message }
    return { data }
  }

  // Associate: RLS handles filtering, but we still join
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      post_actions (
        id,
        delivery_note,
        liked,
        created_at,
        updated_at,
        user_id
      ),
      post_assignments (
        user_id
      )
    `)
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function createPost(formData: FormData) {
  const { profile } = await getUserWithRole()
  if (!profile || profile.role !== "ADMIN") return { error: "Unauthorized" }

  const supabase = await createClient()

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const due_date = formData.get("due_date") as string
  const assignment_scope = formData.get("assignment_scope") as "ALL" | "SPECIFIC"
  const assignedUsers = formData.getAll("assigned_users") as string[]

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      due_date: due_date || null,
      assignment_scope,
      created_by: profile.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // if specific, insert assignments
  if (assignment_scope === "SPECIFIC" && assignedUsers.length > 0) {
    const assignments = assignedUsers.map((userId) => ({
      post_id: post.id,
      user_id: userId,
    }))

    const { error: assignError } = await supabase
      .from("post_assignments")
      .insert(assignments)

    if (assignError) return { error: assignError.message }
  }

  // Send email notifications to all associates
  if (assignment_scope === "ALL") {
    supabase
      .from("profiles")
      .select("id, name")
      .eq("role", "ASSOCIATE")
      .then(({ data: associates, error: associatesError }) => {
        if (associatesError || !associates || associates.length === 0) return

        // Fetch their emails from AuthenticatorAssertionResponse.users using admin client
        const associateIds = associates.map(a => a.id)

        supabaseAdmin.auth.admin.listUsers().then(({ data: usersData, error: usersError }) => {
          if (usersError || !usersData || usersData.users.length === 0) return

          const emails = usersData.users
            .filter((u) => associateIds.includes(u.id))
            .map(u => u.email)
            .filter(Boolean) as string[]
    
          if (emails.length === 0) return

          transporter.sendMail({
            from: `"Intelligent Spreadsheet" <${process.env.GMAIL_USER}>`,
            bcc: emails.join(","),
            subject: `New Post on ${title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #111;">New Post for ${title}</h2>
                <p style="color: #444;">${content}</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">View Task</a>
              </div>
            `,
          }).catch(console.error)
        })
      })
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function deletePost(postId: string) {
  const { profile } = await getUserWithRole()
  if (!profile || profile.role !== "ADMIN") return { error: "Unauthorized" }

  const supabase = await createClient()

  const { error } = await supabase.from("posts").delete().eq("id", postId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getAssociates() {
  const { profile } = await getUserWithRole()
  if (!profile || profile.role !== "ADMIN") return { error: "Unauthorized" }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "ASSOCIATE")

  if (error) return { error: error.message }
  return { data }
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const due_date = formData.get("due_date") as string

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      due_date: due_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)

  if (error) return { error: error.message }
  revalidatePath("/dashboard")
}