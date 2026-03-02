
import { getUserWithRole } from "@/lib/auth"
import { getPosts } from "@/app/actions/posts"
import { signOut } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import PostsTable from "@/components/CreatePostTable"
import CreatePostForm from "@/components/CreatePostForm"

export default async function DashboardPage() {
  const { profile } = await getUserWithRole()
  console.log("USER PROFILE: ", profile);
  
  if (!profile) redirect("/login")

  const { data: posts, error } = await getPosts()
  if (error) return <p className="p-8 text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Intelligent Spreadsheet</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{profile.name}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              profile.role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {profile.role}
          </span>
          <form>
            <button
              formAction={signOut}
              className="text-sm bg-black text-white px-4 py-1.5 rounded"
            >
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        {profile.role === "ADMIN" && <CreatePostForm />}

        <div className="bg-white rounded shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Posts</h2>
            <span className="text-sm text-gray-400">
              {posts?.length ?? 0} posts
            </span>
          </div>
          <div className="p-4">
            {posts && posts.length > 0 ? (
              <PostsTable
                posts={posts as any}
                role={profile.role as "ADMIN" | "ASSOCIATE"}
                userId={profile.id}
              />
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">
                No posts yet.{" "}
                {profile.role === "ADMIN" && "Create one above."}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}