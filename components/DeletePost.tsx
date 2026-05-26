"use client"

import { deletePost } from "@/app/actions/posts";

interface DeletePostProps {
    postId: string
    onClose: () => void
}

export default function DeletePost({ postId, onClose }: DeletePostProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Post?</h2>
                    <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2 leading-relaxed">
                        This action is irreversible. The post and all associated activity logs will be permanently deleted.
                    </p>
                </div>

                <div className="flex gap-3 p-8 pt-0">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => { await deletePost(postId); onClose(); }}
                        className="flex-1 px-4 py-3 text-xs font-black text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-2xl transition-all uppercase tracking-widest shadow-lg shadow-red-100 dark:shadow-none"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    )
}