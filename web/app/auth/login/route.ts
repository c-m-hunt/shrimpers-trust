import { NextResponse } from "next/server";

export async function GET() {
  // Redirect to NextAuth sign in
  return NextResponse.redirect(new URL("/api/auth/signin", process.env.NEXTAUTH_URL || "http://localhost:3001"));
}
