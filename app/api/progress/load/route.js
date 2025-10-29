import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return Response.json({ progress: {} })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ progress: {} })
    }

    const userId = decoded.id
    const db = await getDatabase()

    const progressDoc = await db.collection("progress").findOne({ userId })

    const progress = progressDoc?.completedSubsections || {}

    return Response.json({ progress })
  } catch (error) {
    console.error("Error loading progress:", error)
    return Response.json({ error: "Failed to load progress" }, { status: 500 })
  }
}
