import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"
import course from "../../../../data/course.json"

export async function POST(request) {
  try {
    console.log("[v0] mark-done API called")

    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      console.error("[v0] No auth token in cookies")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.error("[v0] Invalid token")
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decoded.id
    console.log("[v0] User ID:", userId)

    const { subId } = await request.json()
    console.log("[v0] SubId:", subId)

    let sectionId = null
    let subsectionIndex = null

    for (const section of course.sections) {
      const idx = (section.subsections || []).findIndex((x) => x.id === subId)
      if (idx !== -1) {
        sectionId = section.id
        subsectionIndex = idx
        break
      }
    }

    if (!sectionId || subsectionIndex === null) {
      console.error("[v0] Subsection not found:", subId)
      return Response.json({ error: "Subsection not found" }, { status: 400 })
    }

    console.log("[v0] Found section:", sectionId, "subsection index:", subsectionIndex)

    const db = await getDatabase()
    const progressCollection = db.collection("progress")

    const updateKey = `completedSubsections.${sectionId}.${subsectionIndex}`
    console.log("[v0] Update key:", updateKey)

    const result = await progressCollection.updateOne(
      { userId },
      {
        $set: {
          userId,
          [updateKey]: true,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    console.log("[v0] Update result:", result)

    return Response.json({ success: true, message: "Lesson marked as done" })
  } catch (error) {
    console.error("[v0] Error marking subsection done:", error)
    return Response.json({ error: "Failed to mark subsection done", details: error.message }, { status: 500 })
  }
}
