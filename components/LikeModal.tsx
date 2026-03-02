"use client"

import { useState } from "react"
import { submitAction } from "@/app/actions/postActions"

interface Props {
  postId: string
  postTitle: string
  existingNote?: string
  onClose: () => void
}

export default function LikeModal({ postId, postTitle, existingNote, onClose }: Props) {
  const [note, setNote] = useState(existingNote ?? "")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isEdit = !!existingNote

  async function handleSubmit() {
    if (!note.trim()) {
      setError("Delivery note is required")
      return
    }

    setLoading(true)
    setError(null)

    const result = await submitAction(postId, note)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Update Delivery Note" : "Complete Post"}
        </h2>
        <p className="text-sm text-gray-500 font-medium">{postTitle}</p>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Delivery Note <span className="text-red-500">*</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Scheduled on Buffer, Published on Instagram..."
            rows={3}
            className="border p-2 w-full rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : isEdit ? "Update" : "👍 Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}