"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      try {
        // This exchanges the token in the URL for a session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (!session) {
          setError("No active session. Please login.")
          return
        }

        // Fetch role and redirect accordingly
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (profileError) throw profileError

        if (profile?.role === "ADMIN") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.")
      }
    }

    // Listen for the SIGNED_IN event which fires when the email link is clicked
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (profile?.role === "ADMIN") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    })

    handleCallback()

    return () => listener.subscription.unsubscribe()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!error && (
        <p className="text-center mt-16 text-gray-700 text-lg">
          Processing confirmation...
        </p>
      )}
      {error && (
        <div className="text-center mt-16 space-y-4">
          <p className="text-red-600 text-lg">{error}</p>
          <a href="/login" className="text-blue-600 underline">
            Back to Login
          </a>
        </div>
      )}
    </div>
  )
}