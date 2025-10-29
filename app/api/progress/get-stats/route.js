import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"
import courseData from "../../../../data/course.json"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return new Response(
        JSON.stringify({ stats: { completed: 0, total: 0, percentage: 0 } }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
          },
        }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return new Response(
        JSON.stringify({ stats: { completed: 0, total: 0, percentage: 0 } }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
          },
        }
      )
    }

    const userId = decoded.id
    const db = await getDatabase()
    const progressDoc = await db.collection("progress").findOne({ userId })

    const completedSubsections = progressDoc?.completedSubsections || {}
    let completed = 0

    Object.values(completedSubsections).forEach((section) => {
      if (typeof section === "object") {
        completed += Object.values(section).filter(Boolean).length
      }
    })

    const sections = courseData.sections || courseData.default?.sections || courseData.default || []

    const total = Array.isArray(sections)
      ? sections.reduce((acc, s) => acc + (s.subsections ? s.subsections.length : 0), 0)
      : 0

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    return new Response(
      JSON.stringify({ stats: { completed, total, percentage } }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[v0] Error getting progress stats:", error)
    return new Response(
      JSON.stringify({ stats: { completed: 0, total: 0, percentage: 0 } }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      }
    )
  }
}
