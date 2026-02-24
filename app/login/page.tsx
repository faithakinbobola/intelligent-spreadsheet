"use client"

import { signIn, signUp } from "@/api/actions/auth"
import { useState } from "react"

type Mode = "login" | "signup"

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAction(
    action: typeof signIn | typeof signUp,
    formData: FormData
  ) {
    setLoading(true)
    setError(null)
    const result = await action(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-sm w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h1>

        {/* Tab toggle */}
        <div className="flex border rounded overflow-hidden">
          <button
            onClick={() => { setMode("login"); setError(null) }}
            className={`flex-1 p-2 text-sm transition-colors ${
              mode === "login" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode("signup"); setError(null) }}
            className={`flex-1 p-2 text-sm transition-colors ${
              mode === "signup" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {mode === "signup" && (
            <input
              name="name"
              placeholder="Full Name"
              required
              className="border p-2 w-full rounded"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="border p-2 w-full rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="border p-2 w-full rounded"
          />

          {mode === "signup" && (
            <input
              name="adminKey"
              placeholder="Admin Key (optional)"
              className="border p-2 w-full rounded"
            />
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            formAction={(fd) =>
              handleAction(mode === "login" ? signIn : signUp, fd)
            }
            disabled={loading}
            className="bg-black text-white p-2 w-full rounded disabled:opacity-50 transition-opacity"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}