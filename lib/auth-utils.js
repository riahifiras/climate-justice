import { verifyToken } from "./jwt"

export function getUserFromToken(token) {
  if (!token) return null

  try {
    const decoded = verifyToken(token)
    return decoded
  } catch (error) {
    console.error("[v0] Error decoding token:", error)
    return null
  }
}

export function extractTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.slice(7)
}

export function isTeacher(decoded) {
  return decoded && decoded.role === "teacher"
}

export function isStudent(decoded) {
  return decoded && decoded.role === "student"
}
