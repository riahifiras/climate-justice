import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email || null,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function decodeToken(token) {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}
