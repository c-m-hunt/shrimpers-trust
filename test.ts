import { reconcilePaypalTransactionsForMonth } from "./treasurer/reconciliation.ts";
import { getStartAndEndDates, logger } from "./lib/utils/index.ts";

const { startDate, endDate } = getStartAndEndDates(10, 2024);

logger.info(
  `Reconciling PayPal transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
);

await reconcilePaypalTransactionsForMonth(startDate, endDate);
