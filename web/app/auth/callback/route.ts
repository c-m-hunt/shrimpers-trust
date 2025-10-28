import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "../../../lib/auth0";

export async function GET(request: NextRequest) {
  try {
    // Let the middleware handle the callback processing
    // For now, redirect to home page after successful callback
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=callback_error", request.url),
    );
  }
}
