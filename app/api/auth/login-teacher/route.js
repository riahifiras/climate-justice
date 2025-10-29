import { cookies } from "next/headers"
import { getDatabase } from "../../../../lib/mongodb"
import { generateToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (username === "admin" && password === "climate123") {
      const db = await getDatabase()
      const usersCollection = db.collection("users")

      let teacher = await usersCollection.findOne({ id: "teacher-admin" })
      if (!teacher) {
        teacher = {
          id: "teacher-admin",
          role: "teacher",
          name: "المعلم",
          createdAt: new Date(),
        }
        await usersCollection.insertOne(teacher)
      }

      const token = generateToken(teacher)

      const cookieStore = await cookies()
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return new Response(JSON.stringify({
        user: {
          id: teacher.id,
          role: teacher.role,
          name: teacher.name,
        },
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error in teacher login:", error)
    return new Response(JSON.stringify({ error: "Failed to login" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
