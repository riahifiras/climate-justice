import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    console.log("[v0] scores/save API called")

    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      console.error("[v0] No auth token in cookies")
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.error("[v0] Invalid token")
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const userId = decoded.id
    console.log("[v0] User ID:", userId)

    const { subId, result } = await request.json()
    console.log("[v0] SubId:", subId, "Result:", result)

    if (!subId || !result) {
      console.error("[v0] Missing subId or result")
      return new Response(JSON.stringify({ error: "Missing subId or result" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
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

    return new Response(JSON.stringify({ success: true, message: "Quiz result saved" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[v0] Error saving score:", error)
    return new Response(JSON.stringify({ error: "Failed to save score", details: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
