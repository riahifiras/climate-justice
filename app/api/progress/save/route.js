import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error saving progress:", error)
    return new Response(JSON.stringify({ error: "Failed to save progress" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
