// app/dashboard/layout.tsx

import Link from "next/link"
import { getUserWithRole } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await getUserWithRole()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-6 space-y-4">
        <h2 className="text-xl font-bold">Dashboard</h2>

        <Link href="/dashboard">Home</Link>
        {profile?.role === "ADMIN" && (
          <div className="flex flex-col space-y-1">
            <Link href="/dashboard/admin">
              Admin Panel
            </Link>
            <Link href="/dashboard/admin/create-post">
              Create Post
            </Link>
          </div>
        )}
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}