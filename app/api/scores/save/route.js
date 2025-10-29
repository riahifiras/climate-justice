import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    console.log("[v0] scores/save API called")

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

    const { subId, result } = await request.json()
    console.log("[v0] SubId:", subId, "Result:", result)

    if (!subId || !result) {
      console.error("[v0] Missing subId or result")
      return Response.json({ error: "Missing subId or result" }, { status: 400 })
    }

    const db = await getDatabase()
    const scoresCollection = db.collection("scores")

    const scoresDoc = await scoresCollection.findOne({ userId })
    const scores = scoresDoc?.scores || {}

    // Store quiz result with timestamp
    scores[subId] = {
      ...result,
      savedAt: new Date(),
    }

    console.log("[v0] Saving scores:", scores)

    const updateResult = await scoresCollection.updateOne(
      { userId },
      {
        $set: {
          userId,
          scores,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    console.log("[v0] Update result:", updateResult)

    return Response.json({ success: true, message: "Quiz result saved" })
  } catch (error) {
    console.error("[v0] Error saving score:", error)
    return Response.json({ error: "Failed to save score", details: error.message }, { status: 500 })
  }
}
