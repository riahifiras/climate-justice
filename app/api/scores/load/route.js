import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return new Response(JSON.stringify({ scores: {} }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return new Response(JSON.stringify({ scores: {} }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const userId = decoded.id
    const db = await getDatabase()
    const scoresDoc = await db.collection("scores").findOne({ userId })

    return new Response(JSON.stringify({ scores: scoresDoc?.scores || {} }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error loading scores:", error)
    return new Response(JSON.stringify({ error: "Failed to load scores" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
