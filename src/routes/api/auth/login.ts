import { json } from "@solidjs/router";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userDatabase, JWT_SECRET, sanitizeUser } from "~/lib/database";

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = userDatabase.findUserByEmail(email);
    if (!user) {
      return json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Buat JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
      token
    }, {
      status: 200,
      headers: {
        "Set-Cookie": `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
