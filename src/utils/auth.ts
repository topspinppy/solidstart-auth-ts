

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
  let token: string | null = null;

  // 1. ลอง Authorization header ก่อน
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    const [scheme, headerToken] = authHeader.split(" ");
    if (scheme === "Bearer" && headerToken) {
      token = headerToken;
    }
  }

  // 2. ถ้าไม่มีใน header ให้ลอง cookie
  if (!token) {
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      token = cookies.token || cookies.auth_token || cookies.access_token;
    }
  }

  // 3. ถ้ายังไม่มี token ให้ return null
  if (!token) return null;

  // 4. Verify JWT token
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return payload.userId;
  } catch (err) {
    console.warn("JWT verify failed:", err);
    return null;
  }
}

// Helper function สำหรับ parse cookies
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}


export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    console.warn("JWT verification failed:", err);
    return null;
  }
}
