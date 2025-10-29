import { getDatabase } from "../../../../lib/mongodb"
import { verifyToken } from "../../../../lib/jwt"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return Response.json({ scores: {} })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ scores: {} })
    }

    const userId = decoded.id
    const db = await getDatabase()
    const scoresDoc = await db.collection("scores").findOne({ userId })

    return Response.json({ scores: scoresDoc?.scores || {} })
  } catch (error) {
    console.error("Error loading scores:", error)
    return Response.json({ error: "Failed to load scores" }, { status: 500 })
  }
}
