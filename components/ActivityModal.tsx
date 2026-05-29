"use client"

interface Action {
  id: string
  delivery_note: string
  liked: boolean
  created_at: string
  updated_at: string
  profiles: { name: string }
}

interface Props {
  postTitle: string
  postContent: string
  actions: Action[]
  onClose: () => void
}

export default function ActivityModal({ postTitle, postContent, actions, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{postTitle}</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-widest font-bold">Activity Log</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-zinc-800">
                <p className="text-sm text-gray-600 dark:text-zinc-300 italic leading-relaxed wrap-break-word">{postContent}</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Interactions ({actions.length})</h3>
                </div>

                {actions.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50/50 dark:bg-zinc-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                        <p className="text-sm text-gray-400 dark:text-zinc-500">No activity recorded for this post yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                        {actions.map((action) => (
                            <div key={action.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                            {action.profiles.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{action.profiles.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">
                                            {new Date(action.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase">
                                            {new Date(action.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pl-12">
                                    <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-3 border border-gray-100 dark:border-zinc-800">
                                        <p className="text-sm text-gray-700 dark:text-zinc-300">{action.delivery_note}</p>
                                    </div>
                                    {action.updated_at !== action.created_at && (
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold mt-2 uppercase tracking-tight flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Updated {new Date(action.updated_at).toLocaleDateString()} at {new Date(action.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            Close Log
          </button>
        </div>
      </div>
    </div>
  )
}