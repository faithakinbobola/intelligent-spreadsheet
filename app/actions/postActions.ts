"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitAction(postId: string, deliveryNote: string) {
  if (!deliveryNote.trim()) return { error: "Delivery note is required" }

  const { profile } = await getUserWithRole()
  if (!profile) return { error: "Unauthorized" }
  if (profile.role !== "ASSOCIATE") return { error: "Only associates can complete posts" }

  const supabase = await createClient()

  // check for existing action
  const { data: existing } = await supabase
    .from("post_actions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", profile.id)
    .single()

  if (existing) {
    // update instead of insert (schema allows updates)
    const { error } = await supabase
      .from("post_actions")
      .update({ delivery_note: deliveryNote.trim() })
      .eq("post_id", postId)
      .eq("user_id", profile.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("post_actions").insert({
      post_id: postId,
      user_id: profile.id,
      delivery_note: deliveryNote.trim(),
      liked: true,
    })

    if (error) return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}