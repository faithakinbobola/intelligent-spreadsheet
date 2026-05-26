import { getUserWithRole } from "@/lib/auth"
import { getPosts } from "@/app/actions/posts"
import { redirect } from "next/navigation"
import CreatePostForm from "@/components/CreatePostForm"
import PostManager from "@/components/PostManager"

export default async function DashboardPage() {
  const { profile } = await getUserWithRole()

  if (!profile) redirect("/login")

  const { data: posts, error } = await getPosts(profile.role, profile.id)
  if (error) return <p className="p-8 text-red-500">{error}</p>

  const postList = (posts as any ?? [])
  const totalPosts = postList.length
  const myEngagements = postList.filter((p: any) => p.post_actions.some((a: any) => a.user_id === profile.id)).length
  
  const linkedinPostsCount = postList.filter((p: any) => p.content.includes("linkedin")).length
  const instagramPostsCount = postList.filter((p: any) => p.content.includes("instagram")).length

  const latestLinkedin = postList.filter((p: any) => p.content.includes("linkedin"))[0]
  const latestInstagram = postList.filter((p: any) => p.content.includes("instagram"))[0]

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Posts</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalPosts}</p>
          <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Active content
          </div>
        </div>

        {profile.role === "ASSOCIATE" ? (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">My Engagements</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{myEngagements}</p>
            <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed tasks
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total LinkedIn Post(s)</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{linkedinPostsCount}</p>
            <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15.21 17.033a6.002 6.002 0 00-11.21 0M11 20H3m15 20h3" />
              </svg>
              Professional Network
            </div>
          </div>
        )}

        {profile.role === "ASSOCIATE" ? (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Completion Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalPosts > 0 ? Math.round((myEngagements / totalPosts) * 100) : 0}%
            </p>
            <div className="mt-4 w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalPosts > 0 ? (myEngagements / totalPosts) * 100 : 0}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Instagram Post(s)</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{instagramPostsCount}</p>
            <div className="mt-4 flex items-center text-xs text-pink-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Social Reach
            </div>
          </div>
        )}
      </div>

      {profile.role === "ADMIN" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Latest LinkedIn Post
              </h3>
              {latestLinkedin && (
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  {new Date(latestLinkedin.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            {latestLinkedin ? (
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                <p className="text-sm text-gray-700 dark:text-zinc-300 font-medium line-clamp-3">
                  {latestLinkedin.content}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-4">No LinkedIn posts published yet.</p>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                Latest Instagram Post
              </h3>
              {latestInstagram && (
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  {new Date(latestInstagram.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            {latestInstagram ? (
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                <p className="text-sm text-gray-700 dark:text-zinc-300 font-medium line-clamp-3">
                  {latestInstagram.content}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-4">No Instagram posts published yet.</p>
            )}
          </div>
        </div>
      )}



      {profile.role === "ADMIN" && (
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Content Management</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Create and manage posts for your associates.</p>
          </div>
          <CreatePostForm />
        </div>
      )}

      <PostManager 
        initialPosts={postList} 
        role={profile.role as "ADMIN" | "ASSOCIATE"} 
        userId={profile.id} 
      />
    </div>
  )
}