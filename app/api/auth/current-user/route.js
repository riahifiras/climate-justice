import { verifyToken } from "../../../../lib/jwt"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      })
    }

    return new Response(
      JSON.stringify({
        user: {
          id: decoded.id,
          role: decoded.role,
          name: decoded.name,
          email: decoded.email,
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
    console.error("Error fetching current user:", error)
    return new Response(JSON.stringify({ user: null }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    })
  }
}
