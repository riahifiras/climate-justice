"use client"
import { useEffect, useState } from "react"
import { getCurrentUser, logout } from "../lib/auth"

export default function UserBadge() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser()
      setUser(u)
      setLoading(false)
    }
    fetchUser()

    const handler = async () => {
      const u = await getCurrentUser()
      setUser(u)
    }
    window.addEventListener("cj-auth-changed", handler)
    return () => window.removeEventListener("cj-auth-changed", handler)
  }, [])

  if (loading || !user) return null

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-cj-green text-white flex items-center justify-center">
        {user.name ? user.name[0] : "U"}
      </div>
      <div className="text-sm text-gray-700">
        {user.name} {user.role === "teacher" ? "(المعلم)" : ""}
      </div>
      <button
        onClick={async () => {
          await logout()
          setUser(null)
          window.dispatchEvent(new Event("cj-auth-changed"))
        }}
        className="text-xs text-red-500"
      >
        تسجيل خروج
      </button>
    </div>
  )
}
