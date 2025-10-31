"use client"
import { useEffect, useState } from "react"
import { resetProgressForStudent, resetScoresForStudent } from "../lib/tracking"

export default function TeacherView() {
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/teacher/student-progress", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setStudents(data.students || [])
        } else {
          console.error("[v0] Failed to load students:", response.status)
          setStudents([])
        }
      } catch (error) {
        console.error("[v0] Error loading students:", error)
        setStudents([])
      }
      setLoading(false)
    }

    fetchStudents()
  }, [])

  return (
    <div>
      <div className="card mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm">عدد الطلاب المسجلين: {students.length}</div>
          <div className="text-lg font-semibold">لوحة المعلم</div>
        </div>
        <div>
          <select
            onChange={(e) => setSelected(students.find((s) => s.id === e.target.value))}
            disabled={loading}
            className="p-2 border rounded"
          >
            <option value="">اختر طالبًا</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selected && (
        <div className="card">{loading ? "جاري التحميل..." : "اختر طالبًا من القائمة أعلاه لعرض النتائج والتقدّم."}</div>
      )}

      {selected && (
        <div>
          <div className="card mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-sm text-gray-600">البريد الإلكتروني: {selected.email}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await resetProgressForStudent(selected.id)
                    // Refresh students list
                    const response = await fetch("/api/teacher/student-progress", {
                      credentials: "include",
                    })
                    if (response.ok) {
                      const data = await response.json()
                      setStudents(data.students || [])
                      setSelected(null)
                    }
                  }}
                  disabled={loading}
                  className="px-3 py-2 bg-yellow-500 text-white rounded"
                >
                  إعادة تعيين التقدّم
                </button>
                <button
                  onClick={async () => {
                    await resetScoresForStudent(selected.id)
                    // Refresh students list
                    const response = await fetch("/api/teacher/student-progress", {
                      credentials: "include",
                    })
                    if (response.ok) {
                      const data = await response.json()
                      setStudents(data.students || [])
                      setSelected(null)
                    }
                  }}
                  disabled={loading}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  حذف نتائج
                </button>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="text-sm font-semibold mb-2">التقدم الإجمالي</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-cj-green h-full transition-all duration-300"
                    style={{
                      width: `${selected.progress?.percentage || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-sm font-semibold">
                {selected.progress?.completed || 0} / {selected.progress?.total || 0}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-semibold mb-3">نتائج الاختبارات</div>
            {selected.quizzesTaken === 0 ? (
              <div className="text-gray-500">لم يأخذ هذا الطالب أي اختبارات بعد.</div>
            ) : (
              <div className="text-sm">
                عدد الاختبارات المأخوذة: <span className="font-semibold">{selected.quizzesTaken}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
