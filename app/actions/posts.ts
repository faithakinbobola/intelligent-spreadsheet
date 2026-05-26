"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserWithRole, requireAdmin } from "@/lib/auth"
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

export async function getPosts(role?: string, userId?: string) {
  const supabase = await createClient()
  
  let currentRole = role
  let currentUserId = userId

  if (!currentRole || !currentUserId) {
    const { profile } = await getUserWithRole()
    if (!profile) return { error: "Unauthorized" }
    currentRole = profile.role
    currentUserId = profile.id
  }

  if (currentRole === "ADMIN") {
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

  // Associate: RLS handles filtering posts, but we should also filter joins for privacy/speed
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
    .eq("post_actions.user_id", currentUserId)
    .eq("post_assignments.user_id", currentUserId)
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

  // Handle email notifications
  try {
    let targetUserIds: string[] = []

    if (assignment_scope === "ALL") {
      const { data: associates } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "ASSOCIATE")
      
      if (associates) {
        targetUserIds = associates.map(a => a.id)
      }
    } else if (assignment_scope === "SPECIFIC" && assignedUsers.length > 0) {
      targetUserIds = assignedUsers
    }

    if (targetUserIds.length > 0) {
      // Fetch emails from auth using admin client
      // Note: listUsers is paginated, for large teams we might need to handle pagination
      const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (!usersError && usersData?.users) {
        const emails = usersData.users
          .filter((u) => targetUserIds.includes(u.id))
          .map(u => u.email)
          .filter(Boolean) as string[]

        if (emails.length > 0) {
          // We don't await this to keep the response fast, 
          // but we use a more robust way to trigger it
          transporter.sendMail({
            from: `"Intelligent Spreadsheet" <${process.env.GMAIL_USER}>`,
            bcc: emails.join(","),
            subject: `New Post on ${title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #0070f3; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 20px;">New Content Published</h1>
                </div>
                <div style="padding: 30px; background-color: white;">
                  <h2 style="color: #111; margin-top: 0;">${title}</h2>
                  <p style="color: #444; line-height: 1.6; font-size: 15px;">${content}</p>
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">View in Dashboard</a>
                  </div>
                </div>
                <div style="padding: 15px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #eee;">
                  <p style="color: #888; font-size: 12px; margin: 0;">This is an automated notification from Intelligent Spreadsheet.</p>
                </div>
              </div>
            `,
          }).catch(err => console.error("Email send failed:", err))
        }
      }
    }
  } catch (notificationError) {
    console.error("Notification logic failed:", notificationError)
    // We don't return error here to ensure the post creation is still considered successful
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
  const { supabase, profile } = await requireAdmin()
  if (!profile) return { error: "Unauthorized" }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const due_date = formData.get("due_date") as string

  const { error } = await supabase
    .from("posts")
    .update({
      title: title.trim(),
      content: content.trim(),
      due_date: due_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)

  if (error) return { error: error.message }
  revalidatePath("/dashboard")
  return { success: true }
}