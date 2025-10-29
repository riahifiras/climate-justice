"use client"
import ClientOnly from "./ClientOnly"
import { useEffect, useState } from "react"
import { loadProgress } from "../lib/tracking"
import { getCurrentUser } from "../lib/auth"

export default function SectionCard({ section }) {
  return (
    <ClientOnly fallback={<div className="card">تحميل...</div>}>
      <InnerSectionCard section={section} />
    </ClientOnly>
  )
}

function InnerSectionCard({ section }) {
  const [progress, setProgress] = useState({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initCard = async () => {
      const u = await getCurrentUser()
      setUser(u)

      const data = await loadProgress()
      setProgress(data || {})
      setLoading(false)
    }

    initCard()

    const handler = async () => {
      const data = await loadProgress()
      setProgress(data || {})
    }
    window.addEventListener("cj-progress-changed", handler)
    return () => window.removeEventListener("cj-progress-changed", handler)
  }, [section.id])

  if (loading) return <div className="card">تحميل...</div>

  const subs = section.subsections || []
  const sectionProgress = progress[section.id] || {}

  const doneArr = subs.map((_, idx) => sectionProgress[idx] === true)
  console.log("yyyyyyyyyyy", doneArr)
  const allDone = subs.length > 0 && doneArr.every(Boolean)

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold">{section.title}</h3>
        {allDone && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cj-green text-white ml-2">
            تم
          </span>
        )}
      </div>
      <div className="space-y-4">
        {subs.map((sub, idx) => {
          const done = doneArr[idx]
          const key = sub && sub.id ? sub.id : idx
          const title = sub && sub.title ? sub.title : String(sub)

          let unlocked = true
          if (user && user.role !== "teacher") {
            unlocked = idx === 0 || doneArr[idx - 1]
          }

          return (
            <div key={key} className="flex items-start justify-between gap-4">
              <div className="flex-1 flex items-center gap-2">
                <div className="text-base">{title}</div>
                {done && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cj-green text-white ml-2">
                    تم
                  </span>
                )}
              </div>
              <div className="flex-shrink-0">
                {sub &&
                  sub.id &&
                  (unlocked ? (
                    <a
                      href={`/lesson/${sub.id}`}
                      className="px-3 py-1.5 rounded-md text-sm font-medium shadow-sm bg-cj-green text-white hover:bg-cj-green/90 transition"
                    >
                      دخول المقطع
                    </a>
                  ) : (
                    <button
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
                      disabled
                      title="أكمل المقطع السابق أولاً"
                    >
                      مغلق
                    </button>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
