"use client"

import { deletePost } from "@/app/actions/posts";

interface DeletePostProps {
    postId: string
    onClose: () => void
}

export default function DeletePost({ postId, onClose }: DeletePostProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
                <div className="flex flex-col gap-1">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Delete post?</h2>
                    <p className="text-sm text-gray-500">This action cannot be undone. The post will be permanently removed.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => { await deletePost(postId); onClose(); }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}