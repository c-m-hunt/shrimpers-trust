import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

const apiHost = process.env.NEXT_PUBLIC_API_HOST;

export const POST = withApiAuthRequired(
  async function passwordreset(request: NextApiRequest) {
    const formData = await request.json();
    const response = await fetch(`${apiHost}/tools/passwordreset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return Response.json({ data }, { status: response.status });
  },
);
