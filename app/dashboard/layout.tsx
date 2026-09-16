// app/dashboard/layout.tsx

import { getUserWithRole } from "@/lib/auth"
import { signOut } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "./Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await getUserWithRole()

  if (!profile) redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black font-[family-name:var(--font-geist-sans)]">
      <Sidebar profile={profile} signOut={signOut} />

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:ml-64 flex flex-col pt-14 lg:pt-0">
        <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Dashboard</h1>
            <span className="text-gray-300 dark:text-zinc-700">/</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Add notifications or search here if needed */}
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
               <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-[1600px] mx-auto w-full min-w-0 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  )
}