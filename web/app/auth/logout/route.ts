import { NextResponse } from "next/server";

export async function GET() {
  // Create logout URL manually since Auth0 v4 client doesn't expose direct logout method
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const returnTo = encodeURIComponent(
    process.env.APP_BASE_URL || "http://localhost:3001",
  );

  const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;

  // Clear session cookies and redirect to Auth0 logout
  const response = NextResponse.redirect(logoutUrl);

  // Clear Auth0 session cookies
  response.cookies.delete("__txn_state");
  response.cookies.delete("appSession");

  return response;
}
