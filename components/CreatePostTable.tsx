"use client"

import { useState } from "react"
import LikeModal from "./LikeModal"
import ActivityModal from "./ActivityModal"
import { deletePost } from "@/app/actions/posts"

interface Action {
  id: string
  delivery_note: string
  liked: boolean
  created_at: string
  updated_at: string
  user_id: string
  profiles?: { name: string }
}

interface Assignment {
  user_id: string
  profiles?: { name: string }
}

interface Post {
  id: string
  title: string
  content: string
  due_date: string | null
  assignment_scope: "ALL" | "SPECIFIC"
  created_at: string
  post_actions: Action[]
  post_assignments: Assignment[]
}

interface Props {
  posts: Post[]
  role: "ADMIN" | "ASSOCIATE"
  userId: string
}

export default function PostsTable({ posts, role, userId }: Props) {
  const [likeModal, setLikeModal] = useState<Post | null>(null)
  const [activityModal, setActivityModal] = useState<Post | null>(null)

  function myAction(post: Post) {
    return post.post_actions.find((a) => a.user_id === userId)
  }

  async function handleDelete(postId: string) {
    if (!confirm("Delete this post?")) return
    await deletePost(postId)
  }

  return (
    <>
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-black text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Content</th>
              <th className="px-4 py-3 font-semibold">Due Date</th>
              {/* <th className="px-4 py-3 font-semibold">Scope</th> */}
              <th className="px-4 py-3 font-semibold">👍 Likes</th>
              {role === "ADMIN" && (
                <th className="px-4 py-3 font-semibold">Activity</th>
              )}
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => {
              const action = myAction(post)

              return (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-37.5 truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-white max-w-50 truncate">
                    {post.content}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-white whitespace-nowrap">
                    {post.due_date
                      ? new Date(post.due_date).toLocaleDateString()
                      : "—"}
                  </td>
                  {/* <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        post.assignment_scope === "ALL"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {post.assignment_scope}
                    </span>
                  </td> */}
                  <td className="px-4 py-3 font-semibold">
                    {post.post_actions.length}
                  </td>

                  {role === "ADMIN" && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActivityModal(post)}
                        className="text-blue-600 underline text-xs hover:text-blue-800"
                      >
                        View list
                      </button>
                    </td>
                  )}

                  <td className="px-4 py-3">
                    {role === "ASSOCIATE" ? (
                      action ? (
                        <button
                          onClick={() => setLikeModal(post)}
                          className="text-green-600 text-xs font-medium hover:underline"
                        >
                          ✅ Edit note
                        </button>
                      ) : (
                        <button
                          onClick={() => setLikeModal(post)}
                          className="text-xl hover:scale-110 transition-transform"
                        >
                          👍
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 text-xs hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {likeModal && (
        <LikeModal
          postId={likeModal.id}
          postTitle={likeModal.title}
          existingNote={myAction(likeModal)?.delivery_note}
          onClose={() => setLikeModal(null)}
        />
      )}

      {activityModal && (
        <ActivityModal
          postTitle={activityModal.title}
          postContent={activityModal.content}
          actions={activityModal.post_actions as any}
          onClose={() => setActivityModal(null)}
        />
      )}
    </>
  )
}