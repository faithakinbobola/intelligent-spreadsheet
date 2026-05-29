"use client"

import { useState } from "react"
import LikeModal from "./LikeModal"
import ActivityModal from "./ActivityModal"
import CreatePostForm from "./CreatePostForm"
import  DeletePost  from "./DeletePost"
import { Post, Props } from "@/types"

export default function PostsTable({ posts, role, userId }: Props) {
  const [likeModal, setLikeModal] = useState<Post | null>(null)
  const [activityModal, setActivityModal] = useState<Post | null>(null)
  const [editModal, setEditModal] = useState<Post | null>(null)
  const [deleteModal, setDeleteModal] = useState<Post | null>(null)

  function myAction(post: Post) {
    return post.post_actions.find((a) => a.user_id === userId)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-zinc-800">
              <th className="px-6 py-4 font-semibold text-gray-400 dark:text-zinc-500 text-left uppercase tracking-wider text-[10px]">Post Details</th>
              <th className="px-6 py-4 font-semibold text-gray-400 dark:text-zinc-500 text-center uppercase tracking-wider text-[10px]">Engagement</th>
              {role === "ADMIN" && (
                <th className="px-6 py-4 font-semibold text-gray-400 dark:text-zinc-500 text-center uppercase tracking-wider text-[10px]">Monitoring</th>
              )}
              {role === "ADMIN" && (
                <th className="px-6 py-4 font-semibold text-gray-400 dark:text-zinc-500 text-center uppercase tracking-wider text-[10px]">Update</th>
              )}
              <th className="px-6 py-4 font-semibold text-gray-400 dark:text-zinc-500 text-right uppercase tracking-wider text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {posts.map((post) => {
              const action = myAction(post)

              return (
                <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                          post.title.toLowerCase().includes('instagram') 
                          ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' 
                          : post.title.toLowerCase().includes('linkedin')
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {post.title.toLowerCase().includes('instagram') ? 'IG' : post.title.toLowerCase().includes('linkedin') ? 'LI' : 'Post'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-1 max-w-md">
                        {post.content}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-medium">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5 text-center">
                    {role === "ASSOCIATE" ? (
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${action ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 shadow-sm border border-yellow-100 dark:border-yellow-900/30' : 'bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 border border-gray-100 dark:border-zinc-800'}`}>
                         <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.333a2 2 0 00-.8 0z" />
                         </svg>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 px-2.5 py-1 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold text-gray-700 dark:text-zinc-200">{post.post_actions.length}</span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Likes</span>
                      </div>
                    )}
                  </td>

                  {role === "ADMIN" && (
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => setActivityModal(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Activity
                      </button>
                    </td>
                  )}

                  {role === "ADMIN" && (
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => setEditModal(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </td>
                  )}

                  <td className="px-6 py-5 text-right">
                    {role === "ASSOCIATE" ? (
                      action ? (
                        <button
                          onClick={() => setLikeModal(post)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30 hover:bg-green-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => setLikeModal(post)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          Action Required
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => setDeleteModal(post)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Post"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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

      {editModal && (
        <CreatePostForm
          editPost={editModal}
          onClose={() => setEditModal(null)}
        />
      )}

      {deleteModal && (
        <DeletePost 
          postId={deleteModal.id}
          onClose={() => setDeleteModal(null)}
        />
      )
      }
    </>
  )
}