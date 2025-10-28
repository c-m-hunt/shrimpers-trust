import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // NextAuth handles callbacks at /api/auth/callback/azure-ad
  return NextResponse.redirect(new URL("/", request.url));
}
