

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}

interface JwtPayload {
  userId: string;
  email: string;
  iat: number; // issued at
  exp: number; // expiration time
}

export function validateAuth(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const [, token] = authHeader.split(" ");
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload.userId;
  } catch (err) {
    console.warn("JWT verify failed:", err);
    return null;
  }
}
