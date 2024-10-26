import { reconcilePaypalTransactionsForMonth } from "./lib/paypal/reconciliation.ts";
import logger, { getStartAndEndDates } from "./lib/utils/index.ts";

const { startDate, endDate } = getStartAndEndDates(9, 2024);
logger.info(
  `Reconciling PayPal transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
);

await reconcilePaypalTransactionsForMonth(startDate, endDate);
