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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Note" : "Submit Completion"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Target Post</p>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">{postTitle}</p>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Delivery Details</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Published on Instagram, Scheduled via Buffer..."
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 dark:text-white"
                />
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 italic ml-1">* Please specify the platform and method used.</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-bold">{error}</p>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-blue-600 dark:bg-white text-white dark:text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {loading ? (
                        "Submitting..."
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isEdit ? "Update Note" : "Submit Completion"}
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}