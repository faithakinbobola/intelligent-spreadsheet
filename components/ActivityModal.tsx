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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black dark:border dark:border-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">{postTitle}</h2>
            <p className="text-sm text-gray-500 dark:text-white mt-1 wrap-break-word">{postContent}</p>
          </div>
          <div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-white text-xl shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-3">
            Activity ({actions.length})
          </h3>

          {actions.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-white">No activity yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {actions.map((action) => (
                <div key={action.id} className="border rounded p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm flex items-center gap-1 dark:text-white">
                      {action.liked && "👍"} {action.profiles.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white">
                      {new Date(action.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-white">{action.delivery_note}</p>
                  {action.updated_at !== action.created_at && (
                    <p className="text-xs text-gray-400 dark:text-white">
                      Updated {new Date(action.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}