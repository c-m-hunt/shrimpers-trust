import { apiHost } from "@/app/api/consts";
import { hasRole, roles } from "@/src/roles";
import { CardSummary, SummaryData } from "@/src/types/finance";

export type ResponseData = {
  data: SummaryData | CardSummary;
  error?: string;
};

export const GET = async function monthlyReport(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ type: string; month: string; year: string }>;
  },
) {
  const hasPermission = await hasRole(roles.financeAdmin);
  if (!hasPermission) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }
  const { type, month, year } = await params;
  const url = `${apiHost}/finance/${type}/${month}/${year}`;
  const response = await fetch(url);
  const data: ResponseData = await response.json();
  return Response.json({ data }, { status: response.status });
};
