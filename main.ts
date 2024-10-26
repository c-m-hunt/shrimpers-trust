import { reconcilePaypalTransactionsForMonth } from "./lib/paypal/reconciliation.ts";
import logger, { createDateFromMonth } from "./lib/utils/index.ts";

/**
 * AMEND START AND END DATE HERE
 */
const startDate = createDateFromMonth("8", "2024");
const endDate = createDateFromMonth("9", "2024");

// const startDate = createDateFromMonth("9", "2024");
// const endDate = createDateFromMonth("10", "2024");

logger.info(
  `Reconciling PayPal transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
);

await reconcilePaypalTransactionsForMonth(startDate, endDate);
