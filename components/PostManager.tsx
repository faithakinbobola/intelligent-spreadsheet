"use client"

import { useState, useMemo } from "react"
import PostsTable from "./CreatePostTable"
import FilterBar from "./FilterBar"

interface Action {
  id: string
  delivery_note: string
  liked: boolean
  created_at: string
  updated_at: string
  user_id: string
  profiles?: { name: string }
}

interface Assignment {
  user_id: string
  profiles?: { name: string }
}

interface Post {
  id: string
  title: string
  content: string
  due_date: string | null
  assignment_scope: "ALL" | "SPECIFIC"
  created_at: string
  post_actions: Action[]
  post_assignments: Assignment[]
}

interface Props {
  initialPosts: Post[]
  role: "ADMIN" | "ASSOCIATE"
  userId: string
}

export default function PostManager({ initialPosts, role, userId }: Props) {
  const [filters, setFilters] = useState<any>({
    platform: "all",
    timeframe: "all",
    startDate: null,
    endDate: null,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Date filtering
      const postDate = new Date(post.created_at)
      postDate.setHours(0, 0, 0, 0)

      if (filters.startDate) {
        const start = new Date(filters.startDate)
        start.setHours(0, 0, 0, 0)
        
        if (filters.endDate) {
          const end = new Date(filters.endDate)
          end.setHours(23, 59, 59, 999)
          if (postDate < start || postDate > end) return false
        } else {
          if (postDate.getTime() !== start.getTime()) return false
        }
      } else {
        // Handle timeframe presets if no custom date is selected
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        
        if (filters.timeframe === "day") {
           if (postDate.getTime() !== now.getTime()) return false
        } else if (filters.timeframe === "week") {
          const weekAgo = new Date(now)
          weekAgo.setDate(now.getDate() - 7)
          if (postDate < weekAgo) return false
        } else if (filters.timeframe === "month") {
          const monthAgo = new Date(now)
          monthAgo.setMonth(now.getMonth() - 1)
          if (postDate < monthAgo) return false
        }
      }

      // Platform filtering
      if (filters.platform !== "all") {
        if (!post.title.toLowerCase().includes(filters.platform.toLowerCase())) return false
      }

      return true
    })
  }, [initialPosts, filters])

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPosts.slice(start, start + itemsPerPage)
  }, [filteredPosts, currentPage])

  // Reset page when filters change
  const handleFilterChange = (f: any) => {
    setFilters(f)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {role === "ADMIN" && (
        <FilterBar onChange={handleFilterChange} />
      )}
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Posts</h2>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {filteredPosts.length} results
            </span>
          </div>
          <div className="flex items-center gap-3">
             {totalPages > 1 && (
                <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">Page {currentPage} of {totalPages}</span>
             )}
          </div>
        </div>
        
        <div className="p-0">
          {paginatedPosts.length > 0 ? (
            <>
              <PostsTable
                posts={paginatedPosts as any}
                role={role}
                userId={userId}
              />
              
              {totalPages > 1 && (
                <div className="p-6 flex items-center justify-center gap-2 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        if (totalPages > 7) {
                            if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                    >
                                        {p}
                                    </button>
                                )
                            }
                            if (p === currentPage - 2 || p === currentPage + 2) {
                                return <span key={p} className="px-1 text-gray-300 dark:text-zinc-700 font-bold">...</span>
                            }
                            return null
                        }
                        
                        return (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                            >
                                {p}
                            </button>
                        )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-lg">No results found</p>
              <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">We couldn't find any posts matching your current filters.</p>
              <button 
                onClick={() => handleFilterChange({ platform: "all", timeframe: "all", startDate: null, endDate: null })}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

