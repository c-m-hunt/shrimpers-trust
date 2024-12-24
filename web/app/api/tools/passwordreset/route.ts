import { apiHost } from "../../consts";

export const POST = async function passwordreset(request: Request) {
  const formData = await request.json();
  const response = await fetch(`${apiHost}/tools/passwordreset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  return Response.json({ data }, { status: response.status });
};
