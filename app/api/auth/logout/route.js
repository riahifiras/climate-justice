import { cookies } from "next/headers"

export async function POST(request) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return Response.json({ success: true })
}
