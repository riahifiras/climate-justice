import { verifyToken } from "../../../../lib/jwt"

export async function GET(request) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return Response.json({ user: null })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return Response.json({ user: null })
    }

    return Response.json({
      user: {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      },
    })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return Response.json({ user: null })
  }
}
