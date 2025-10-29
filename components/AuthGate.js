"use client"
import { useState, useEffect } from "react"
import { getCurrentUser, addStudent, loginTeacher } from "../lib/auth"

export default function AuthGate({ onAuth }) {
  const [mode, setMode] = useState(null) // 'student' | 'teacher'
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const u = await getCurrentUser()
      if (u && onAuth) onAuth(u)
    }
    checkUser()
  }, [onAuth])

  async function joinAsStudent() {
    if (!name.trim()) {
      setError("أدخل اسمك")
      return
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("أدخل بريدًا إلكترونيًا صحيحًا")
      return
    }

    setLoading(true)
    const result = await addStudent(name.trim(), email.trim())
    setLoading(false)

    if (!result) {
      setError("يوجد مستخدم بنفس الاسم والبريد الإلكتروني")
      return
    }

    const user = { role: "student", id: result.user.id, name: result.user.name, email: result.user.email }
    if (onAuth) onAuth(user)
  }

  async function handleLoginTeacher() {
    setLoading(true)
    const result = await loginTeacher(username, password)
    setLoading(false)

    if (result) {
      if (onAuth) onAuth(result.user)
    } else {
      setError("بيانات خاطئة")
    }
  }

  // simple UI
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">اختر دورك</h3>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("student")}
            disabled={loading}
            className={"flex-1 py-2 rounded " + (mode === "student" ? "bg-cj-green text-white" : "bg-gray-100")}
          >
            طالب/طالبة
          </button>
          <button
            onClick={() => setMode("teacher")}
            disabled={loading}
            className={"flex-1 py-2 rounded " + (mode === "teacher" ? "bg-cj-green text-white" : "bg-gray-100")}
          >
            معلم/معلمة
          </button>
        </div>

        {mode === "student" && (
          <div>
            <label className="text-sm">الاسم</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mt-1"
            />
            <label className="text-sm mt-2">البريد الإلكتروني</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mt-1"
              type="email"
            />
            <div className="mt-4 flex justify-end">
              <button onClick={joinAsStudent} disabled={loading} className="px-4 py-2 bg-cj-green text-white rounded">
                {loading ? "جاري..." : "انضم"}
              </button>
            </div>
          </div>
        )}

        {mode === "teacher" && (
          <div>
            <label className="text-sm">اسم المستخدم</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mt-1"
            />
            <label className="text-sm mt-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mt-1"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleLoginTeacher}
                disabled={loading}
                className="px-4 py-2 bg-cj-green text-white rounded"
              >
                {loading ? "جاري..." : "تسجيل دخول"}
              </button>
            </div>
          </div>
        )}

        {error && <div className="text-sm text-red-500 mt-3">{error}</div>}
      </div>
    </div>
  )
}
