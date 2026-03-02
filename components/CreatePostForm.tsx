"use client"

import { createPost, getAssociates } from "@/app/actions/posts"
import { useState, useEffect } from "react"

interface Associate {
  id: string
  name: string
}

export default function CreatePostForm() {
  const [open, setOpen] = useState(false)
  const [scope, setScope] = useState<"ALL" | "SPECIFIC">("ALL")
  const [associates, setAssociates] = useState<Associate[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  async function handleSubmit(formData: FormData) {
    if (scope === "SPECIFIC" && selectedUsers.length === 0) {
      setError("Select at least one associate")
      return
    }

    setLoading(true)
    setError(null)

    selectedUsers.forEach((id) => formData.append("assigned_users", id))
    formData.set("assignment_scope", scope)

    const result = await createPost(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
      setScope("ALL")
      setSelectedUsers([])
    }
    setLoading(false)
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          + New Post
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">Create Post</h2>

            <form className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <input
                  name="title"
                  placeholder="Post title"
                  required
                  className="border p-2 w-full rounded text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  name="content"
                  placeholder="Post content or description..."
                  rows={3}
                  required
                  className="border p-2 w-full rounded text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  name="due_date"
                  type="datetime-local"
                  className="border p-2 w-full rounded text-sm"
                />
              </div>

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
                  <button
                    type="button"
                    onClick={() => setScope("SPECIFIC")}
                    className={`flex-1 p-2 text-sm border rounded ${
                      scope === "SPECIFIC" ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    Specific Associates
                  </button>
                </div>
              </div>

              {scope === "SPECIFIC" && (
                <div className="border rounded p-3 space-y-2 max-h-40 overflow-y-auto">
                  {associates.length === 0 ? (
                    <p className="text-sm text-gray-400">No associates found</p>
                  ) : (
                    associates.map((a) => (
                      <label
                        key={a.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(a.id)}
                          onChange={() => toggleUser(a.id)}
                        />
                        {a.name}
                      </label>
                    ))
                  )}
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  formAction={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-black text-white rounded disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}