"use client"

import { useState } from "react"
import { signUp } from "@/app/actions/auth"

export default function SignUpPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    // adminKey: "",
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
      formData.append(key, value as string)
    )

    const res = await signUp(formData)
    setLoading(false)
    if (res.error) {
      setMessage(res.error)
    } else {
      setMessage(res.message || "Success! Check your email to confirm.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          value={formState.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
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
        {/* <input
          name="adminKey"
          type="text"
          placeholder="Admin Key (Optional)"
          value={formState.adminKey}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        /> */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}