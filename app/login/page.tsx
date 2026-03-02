"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/app/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    adminKey: "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    Object.entries(formState).forEach(([key, value]) =>
      formData.append(key, value)
    )

    const res = await signIn(formData)
    setLoading(false)

    if (res.error) {
      setMessage(res.error)
    } else if (res.redirect) {
      router.push(res.redirect)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {message && (
        <p className="mb-4 text-center text-red-600">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="adminKey"
          type="password"
          placeholder="Admin Key (optional)"
          value={formState.adminKey}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}