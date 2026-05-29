"use client"

import { createPost, updatePost, getAssociates } from "@/app/actions/posts"
import { Associate, CreateFormProps } from "@/types"
import { useState, useEffect, useRef } from "react"

export default function CreatePostForm({ editPost, onClose }: CreateFormProps) {
  const isEditing = !!editPost

  const [open, setOpen] = useState(isEditing)
  const [scope, setScope] = useState<"ALL">("ALL")
  const [associates, setAssociates] = useState<Associate[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (open) {
      getAssociates().then((res) => {
        if (res.data) setAssociates(res.data)
      })
    }
  }, [open])

  function handleClose() {
    setOpen(false)
    onClose?.()
  }

  async function handleSubmit(formData: FormData) {
    if(loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    setError(null)

    let result

    if (isEditing) {
      result = await updatePost(editPost.id, formData)
    } else {
      selectedUsers.forEach((id) => formData.append("assigned_users", id))
      formData.set("assignment_scope", scope)
      result = await createPost(formData)
    }

    if (result?.error) {
      setError(result.error)
    } else {
      handleClose()
      if (!isEditing) {
        setScope("ALL")
        setSelectedUsers([])
      }
    }

    setLoading(false)
    loadingRef.current = false
  }

  return (
    <>
      {!isEditing && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? "Edit Content" : "Create New Post"}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Platform</label>
                <div className="relative">
                  <select 
                    name="title" 
                    required 
                    defaultValue={editPost?.title ?? ""}
                    className="appearance-none w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                  >
                    <option value="" disabled>Select a platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Linkedin">LinkedIn</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Content Details</label>
                <textarea
                  name="content"
                  placeholder="Describe the post content, goals, or instructions..."
                  defaultValue={editPost?.content ?? ""}
                  rows={4}
                  required
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 dark:text-white"
                />
              </div>

              {!isEditing && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setScope("ALL")}
                      className={`flex-1 p-3 text-xs font-bold rounded-xl border transition-all ${
                        scope === "ALL" 
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-md" 
                        : "bg-white dark:bg-zinc-900 text-gray-500 border-gray-100 dark:border-zinc-800 hover:border-blue-400"
                      }`}
                    >
                      All Associates
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-4 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  formAction={handleSubmit}
                  disabled={loading}
                  className="flex-[2] bg-blue-600 dark:bg-white text-white dark:text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {loading
                    ? isEditing ? "Updating..." : "Publishing..."
                    : isEditing ? "Save Changes" : "Publish Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}