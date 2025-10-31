"use client"
import { useEffect, useState } from "react"
import ClientOnly from "./ClientOnly"

function InnerProgress() {
  const [stats, setStats] = useState({ completed: 0, total: 0, percentage: 0 })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const update = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/progress/get-stats", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats || { completed: 0, total: 0, percentage: 0 })
        } else {
          setStats({ completed: 0, total: 0, percentage: 0 })
        }
      } catch (e) {
        console.error("[v0] Error loading progress stats:", e)
        setStats({ completed: 0, total: 0, percentage: 0 })
      }
      setLoading(false)
    }

    update()
    window.addEventListener("cj-progress-changed", update)
    return () => window.removeEventListener("cj-progress-changed", update)
  }, [])

  return (
    <div className="card">
      <h4 className="font-semibold mb-2">تقدّمك</h4>
      <div className="text-sm mb-2">
        {loading ? "جاري التحميل..." : `${stats.completed} من ${stats.total} (${stats.percentage}%)`}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
        <div className="bg-cj-green h-full transition-all duration-300" style={{ width: `${stats.percentage}%` }}></div>
      </div>
      {user && user.role === "teacher" && (
        <div className="text-xs text-gray-400">المعلم: يمكنك إعادة تعيين التقدم من لوحة التحكم</div>
      )}
    </div>
  )
}

export default function ProgressTracker() {
  return (
    <ClientOnly fallback={<div className="card">تحميل...</div>}>
      <InnerProgress />
    </ClientOnly>
  )
}
