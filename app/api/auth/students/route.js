import { getDatabase } from "../../../../lib/mongodb"

export async function GET(request) {
  try {
    const db = await getDatabase()
    const students = await db.collection("users").find({ role: "student" }).toArray()
    return Response.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return Response.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
