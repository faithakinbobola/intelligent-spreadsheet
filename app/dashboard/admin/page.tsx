import UserList from "@/components/UserList"
import { requireAdmin } from "@/lib/auth"
import { User } from "@/types"
// import { createClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  const { supabase, profile } = await requireAdmin()      // check admin
  // const supabase = await createClient()

  const [usersResponse, postsResponse] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, role, created_at, engagementCount:post_actions(count)")
      .order("created_at", { ascending: false }),
    supabase
      .from("posts")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
  ])

  const usersData = usersResponse.data
  const posts = postsResponse.data

  const users = usersData?.map((u: any) => ({
    ...u,
    engagementCount: u.engagementCount?.[0]?.count ?? 0,
  })) as User[]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Users
        </h2>

        <UserList users={users ?? []} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Posts
        </h2>

        {posts?.map((p) => (
          <div key={p.id} className="p-4 border rounded">
            <button type="button">{p.title}</button>
          </div>
        ))}
      </section>
    </div>
  )
}