import { apiHost } from "@/app/api/consts";
import { hasRole, roles } from "@/src/roles";
import { CardSummary, SummaryData } from "@/src/types/finance";

type ResponseData = {
  paypal?: { data: SummaryData };
  zettle?: { data: CardSummary };
};

export const GET = async function passwordreset(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ type: string; month: number; year: number }>;
  },
) {
  if (!(await hasRole(roles.financeAdmin))) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }
  const { type, month, year } = await params;
  const url = `${apiHost}/finance/${type}/${month}/${year}`;
  const response = await fetch(url);
  const data: ResponseData = await response.json();
  return Response.json({ data }, { status: response.status });
};
