import { NextResponse } from "next/server";

export async function GET() {
  // Redirect to NextAuth sign out which handles session cleanup and optional Azure logout
  const base = process.env.NEXTAUTH_URL || "http://localhost:3001";
  return NextResponse.redirect(new URL("/api/auth/signout", base));
}
