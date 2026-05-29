import UserList from "@/components/UserList"
import { requireAdmin } from "@/lib/auth"
import { User } from "@/types"
import { supabaseAdmin } from "@/lib/supabase/admin"

export default async function AdminPage() {
  const { supabase } = await requireAdmin()
  
  const [usersResponse, postsResponse, authUsersResponse] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        id, 
        name, 
        role, 
        created_at, 
        engagements:post_actions(
          created_at,
          posts(title)
        )
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("posts")
      .select("id, title, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.auth.admin.listUsers()
  ])

  const usersData = usersResponse.data
  const posts = postsResponse.data
  const authUsers = authUsersResponse.data?.users ?? []

  const users = usersData?.map((u: any) => {
    const authUser = authUsers.find(au => au.id === u.id)
    const lastSignIn = authUser?.last_sign_in_at ? new Date(authUser.last_sign_in_at).getTime() : 0
    
    const engagementDates = u.engagements?.map((e: any) => new Date(e.created_at).getTime()) ?? []
    const lastEngagement = engagementDates.length > 0 ? Math.max(...engagementDates) : 0
    
    const lastActivity = Math.max(lastSignIn, lastEngagement)

    return {
      ...u,
      engagementCount: u.engagements?.length ?? 0,
      lastActivity: lastActivity > 0 ? new Date(lastActivity).toISOString() : u.created_at,
      engagements: u.engagements?.map((e: any) => ({
        created_at: e.created_at,
        post_title: e.posts?.title ?? "Unknown Post"
      }))
    }
  }) as User[]

  const totalUsers = users?.length ?? 0
  const activeAssociates = users?.filter(u => u.role === "ASSOCIATE" && (u.engagementCount ?? 0) > 0).length ?? 0
  const totalPosts = posts?.length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Monitor user activity and engagements across the platform.</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15.21 17.033a6.002 6.002 0 00-11.21 0M11 20H3m15 20h3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Active Associates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAssociates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Published Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Directory</h2>
        </div>
        <div className="p-6">
          <UserList users={users ?? []} />
        </div>
      </div>
    </div>
  )
}