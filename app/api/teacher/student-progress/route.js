import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"
import course from "../../../../data/course.json"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "teacher") {
      return Response.json({ error: "Only teachers can access this" }, { status: 403 })
    }

    const db = await getDatabase()

    const students = await db.collection("users").find({ role: "student" }).toArray()

    const studentsProgress = await Promise.all(
      students.map(async (student) => {
        const progressDoc = await db.collection("progress").findOne({ userId: student.id })
        const scoresDoc = await db.collection("scores").findOne({ userId: student.id })

        const completedSubsections = progressDoc?.completedSubsections || {}
        let completed = 0
        Object.values(completedSubsections).forEach((section) => {
          if (typeof section === "object") {
            completed += Object.values(section).filter(Boolean).length
          }
        })

        const total = course.sections.reduce((acc, s) => acc + (s.subsections ? s.subsections.length : 0), 0)
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          progress: {
            completed,
            total,
            percentage,
          },
          quizzesTaken: Object.keys(scoresDoc?.scores || {}).length,
        }
      }),
    )

    return Response.json({ students: studentsProgress })
  } catch (error) {
    console.error("Error fetching students progress:", error)
    return Response.json({ error: "Failed to fetch students progress" }, { status: 500 })
  }
}
