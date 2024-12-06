export const ZETTLE_CLIENT_ID = Deno.env.get("ZETTLE_CLIENT_ID") || "";
export const ZETTLE_SECRET = Deno.env.get("ZETTLE_SECRET") || "";

if (!ZETTLE_CLIENT_ID || !ZETTLE_SECRET) {
  throw new Error("Zettle credentials not found");
}

export const DEFAULT_PAGE_SIZE = 500;

export const ZETTLE_FEE = 0.0175;
