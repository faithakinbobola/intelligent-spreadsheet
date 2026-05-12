"use client"

import { createPost, updatePost, getAssociates } from "@/app/actions/posts"
import { useState, useEffect, useRef } from "react"

interface Associate {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  content: string
  due_date: string | null
}

interface Props {
  editPost?: Post        // if passed, form is in edit mode
  onClose?: () => void  // called after save (for modal usage)
}

export default function CreatePostForm({ editPost, onClose }: Props) {
  const isEditing = !!editPost

  const [open, setOpen] = useState(isEditing) // auto-open when editing
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

  function toggleUser(id: string) {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    )
  }

  function handleClose() {
    setOpen(false)
    onClose?.()
  }

  async function handleSubmit(formData: FormData) {
    if(loadingRef.current) return // prevent multiple submissions
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
      {/* Only show the "+ New Post" button in create mode */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white dark:border dark:border-white px-4 py-2 rounded text-sm"
          >
            + New Post
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black dark:border dark:border-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Post" : "Create Post"}
            </h2>

            <form className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <select name="title" id="" required className="border p-2 w-full rounded text-sm">
                  <option value=""><span className="p-2">Select a title</span></option>
                  <option value="Instagram"><span>Instagram</span></option>
                  <option value="Linkedin"><span>Linkedin</span></option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  name="content"
                  placeholder="Post content or description..."
                  defaultValue={editPost?.content ?? ""}
                  rows={3}
                  required
                  className="border p-2 w-full rounded text-sm resize-none"
                />
              </div>

              {/* <div className="space-y-1">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  name="due_date"
                  type="datetime-local"
                  defaultValue={
                    editPost?.due_date
                      ? new Date(editPost.due_date).toISOString().slice(0, 16)
                      : ""
                  }
                  className="border p-2 w-full rounded text-sm"
                />
              </div> */}

              {/* Scope selector only shown when creating */}
              {!isEditing && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Assign To</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setScope("ALL")}
                      className={`flex-1 p-2 text-sm border rounded ${
                        scope === "ALL" ? "bg-black text-white" : "bg-white"
                      }`}
                    >
                      All Associates
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  formAction={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-black dark:bg-white dark:text-black text-white rounded disabled:opacity-50"
                >
                  {loading
                    ? isEditing ? "Saving..." : "Creating..."
                    : isEditing ? "Save" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}