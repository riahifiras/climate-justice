import { getDatabase } from "../../../../lib/mongodb"

export async function GET(request) {
  try {
    const db = await getDatabase()
    const students = await db.collection("users").find({ role: "student" }).toArray()

    return new Response(JSON.stringify({ students }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch students" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
