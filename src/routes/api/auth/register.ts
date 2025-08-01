import { json } from "@solidjs/router";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userDatabase, JWT_SECRET, sanitizeUser } from "~/lib/database";

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    // Validasi input
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return json(
        { error: "Password must be at least 6 characters long" },
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

    // Check apakah user sudah ada
    const existingUser = userDatabase.findUserByEmail(email);
    if (existingUser) {
      return json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat user baru
    const newUser = userDatabase.createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Buat JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return json({
      success: true,
      message: "Account created successfully",
      user: sanitizeUser(newUser),
      token
    }, { 
      status: 201,
      headers: {
        "Set-Cookie": `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
