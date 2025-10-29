import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"
import course from "../../../../data/course.json"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "teacher") {
      return new Response(JSON.stringify({ error: "Only teachers can access this" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
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

    return new Response(JSON.stringify({ students: studentsProgress }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching students progress:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch students progress" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
