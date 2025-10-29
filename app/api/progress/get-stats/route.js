import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"
import courseData from "../../../../data/course.json"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return Response.json({ stats: { completed: 0, total: 0, percentage: 0 } })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ stats: { completed: 0, total: 0, percentage: 0 } })
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

    console.log("[v0] courseData keys:", Object.keys(courseData))
    console.log("[v0] courseData.sections:", courseData.sections)
    console.log("[v0] courseData.default:", courseData.default)

    // Handle both default export and named export
    const sections = courseData.sections || courseData.default?.sections || courseData.default || []
    console.log("[v0] sections:", sections)

    const total = Array.isArray(sections)
      ? sections.reduce((acc, s) => acc + (s.subsections ? s.subsections.length : 0), 0)
      : 0
    console.log("[v0] total calculated:", total)

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    console.log("[v0] Final stats - completed:", completed, "total:", total, "percentage:", percentage)

    return Response.json({ stats: { completed, total, percentage } })
  } catch (error) {
    console.error("[v0] Error getting progress stats:", error)
    return Response.json({ stats: { completed: 0, total: 0, percentage: 0 } }, { status: 500 })
  }
}
