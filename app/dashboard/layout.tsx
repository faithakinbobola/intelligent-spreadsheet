// app/dashboard/layout.tsx

import Link from "next/link"
import { getUserWithRole } from "@/lib/auth"
import { signOut } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await getUserWithRole()

  if (!profile) redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col fixed inset-y-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              IS
            </div>
            <span className="font-bold text-lg tracking-tight dark:text-white">Intelligent</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          {profile.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Administration
              </div>
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15.21 17.033a6.002 6.002 0 00-11.21 0M11 20H3m15 20h3M7.5 5.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM5 20a5 5 0 1110 0v-2a5 5 0 01-10 0v2z" />
                </svg>
                User Management
              </Link>
            </>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {profile.name}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                {profile.role}
              </span>
            </div>
          </div>
          <form>
            <button
              formAction={signOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gray-900 dark:bg-zinc-100 dark:text-black text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-10">
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

        <main className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}