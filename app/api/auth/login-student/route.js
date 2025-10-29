import { cookies } from "next/headers"
import { getDatabase } from "../../../../lib/mongodb"
import { generateToken } from "../../../../lib/jwt"

export async function POST(request) {
  try {
    const { name, email } = await request.json()

    if (!name?.trim() || !email?.trim()) {
      return new Response(JSON.stringify({ error: "Name and email required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    let student = await usersCollection.findOne({
      name: name.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      role: "student",
    })

    if (!student) {
      const id =
        name.trim().toLowerCase().replace(/\s+/g, "-") +
        "-" +
        email
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") +
        "-" +
        Date.now().toString(36)

      student = {
        id,
        role: "student",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date(),
      }

      await usersCollection.insertOne(student)
    }

    const token = generateToken(student)

    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return new Response(
      JSON.stringify({
        user: {
          id: student.id,
          role: student.role,
          name: student.name,
          email: student.email,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("Error in student login:", error)
    return new Response(
      JSON.stringify({ error: "Failed to register student" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      }
    )
  }
}
