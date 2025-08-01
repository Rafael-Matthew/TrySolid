import { json } from "@solidjs/router";
import jwt from "jsonwebtoken";
import { userDatabase, JWT_SECRET, sanitizeUser } from "~/lib/database";

export async function GET({ request }: { request: Request }) {
  try {
    // Ambil token dari cookie
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return json({ authenticated: false }, { status: 401 });
    }

    const token = cookieHeader
      .split(';')
      .find(cookie => cookie.trim().startsWith('auth-token='))
      ?.split('=')[1];

    if (!token) {
      return json({ authenticated: false }, { status: 401 });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Cari user berdasarkan ID
    const user = userDatabase.findUserById(decoded.userId);
    if (!user) {
      return json({ authenticated: false }, { status: 401 });
    }

    return json({
      authenticated: true,
      user: sanitizeUser(user)
    }, { status: 200 });

  } catch (error) {
    console.error("Auth check error:", error);
    return json({ authenticated: false }, { status: 401 });
  }
}
