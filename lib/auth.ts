import { cookies } from "next/headers"

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")
    return !!token
  } catch {
    return false
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error("Unauthorized")
  }
}

