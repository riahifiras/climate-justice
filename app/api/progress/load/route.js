import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return new Response(JSON.stringify({ progress: {} }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return new Response(JSON.stringify({ progress: {} }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const userId = decoded.id
    const db = await getDatabase()

    const progressDoc = await db.collection("progress").findOne({ userId })

    const progress = progressDoc?.completedSubsections || {}

    return new Response(JSON.stringify({ progress }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error loading progress:", error)
    return new Response(JSON.stringify({ error: "Failed to load progress" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
