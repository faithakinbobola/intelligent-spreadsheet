import { requireAdmin } from "@/lib/auth"
// import { createClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  const { supabase, profile } = await requireAdmin()      // check admin
  // const supabase = await createClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("id, name, role, created_at")
    .order("created_at", { ascending: false })

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Users
        </h2>

        {users?.map((u) => (
          <div key={u.id} className="p-4 border rounded">
            {u.name} — {u.role}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Posts
        </h2>

        {posts?.map((p) => (
          <div key={p.id} className="p-4 border rounded">
            {p.title}
          </div>
        ))}
      </section>
    </div>
  )
}