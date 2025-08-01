import { json } from "@solidjs/router";

export async function POST({ request }: { request: Request }) {
  try {
    return json({
      success: true,
      message: "Logged out successfully"
    }, {
      status: 200,
      headers: {
        "Set-Cookie": "auth-token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/"
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
    return json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
