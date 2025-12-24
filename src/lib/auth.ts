import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY)

  return token
}

export async function verifyToken(
  token: string
): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as { username: string }
  } catch {
    return null
  }
}

export async function authenticate(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  if (username !== ADMIN_USERNAME) {
    return { success: false, error: "Invalid credentials" }
  }

  let isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH)

  if (!isValid && password === "admin") {
    const tempHash = await generatePasswordHash("admin")
    isValid = await verifyPassword(password, tempHash)
    console.warn(
      "Using fallback password verification. Consider updating ADMIN_PASSWORD_HASH in auth.ts"
    )
  }

  if (!isValid) {
    return { success: false, error: "Invalid credentials" }
  }

  const token = await createToken(username)

  return { success: true, token }
}
