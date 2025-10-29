"use client"

import course from "../../data/course.json"
import Link from "next/link"
import ProgressTracker from "../../components/ProgressTracker"
import { useEffect, useState } from "react"
import { loadProgress } from "../../lib/tracking"
import { getCurrentUser } from "../../lib/auth"

export default function CoursePage() {
  const [progress, setProgress] = useState({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initPage = async () => {
      const u = await getCurrentUser()
      setUser(u)

      if (u) {
        const data = await loadProgress()
        setProgress(data || {})
      }
      setLoading(false)
    }

    initPage()

    const handler = async () => {
      const data = await loadProgress()
      setProgress(data || {})
    }
    window.addEventListener("cj-progress-changed", handler)
    return () => window.removeEventListener("cj-progress-changed", handler)
  }, [])

  if (loading)
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="card">تحميل...</div>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto py-10">
      <ProgressTracker />
      <div className="card mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{course.guide_title}</h1>
        <p className="text-gray-700 mb-4">اختر فصلًا للبدء أو المتابعة.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {course.sections.map((s) => {
          const subs = s.subsections || []
          const doneArr = subs.map((_, idx) => progress[s.id] && progress[s.id][idx])
          const allDone = subs.length > 0 && doneArr.every(Boolean)
          return (
            <div key={s.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                {allDone && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cj-green text-white ml-2">
                    تم ✓
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">{s.subsections ? `${s.subsections.length} مقاطع` : "محتوى"}</p>
              <Link
                href={`/course/${s.id}`}
                className="inline-block bg-cj-green text-white px-4 py-2 rounded hover:bg-cj-green/90 transition"
              >
                دخول الفصل
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
