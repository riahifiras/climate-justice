import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    if (decoded.role !== "teacher") {
      return Response.json({ error: "Only teachers can reset scores" }, { status: 403 })
    }

    const { userId } = await request.json()
    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()
    await db.collection("scores").deleteOne({ userId })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error resetting scores:", error)
    return Response.json({ error: "Failed to reset scores" }, { status: 500 })
  }
}
