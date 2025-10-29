import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decoded.userId
    const { progress } = await request.json()

    const db = await getDatabase()

    await db.collection("progress").updateOne(
      { userId },
      {
        $set: {
          userId,
          completedSubsections: progress || {},
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving progress:", error)
    return Response.json({ error: "Failed to save progress" }, { status: 500 })
  }
}
