import { getBalancesSingleton } from "./lib/paypal/balances.ts";
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "./lib/paypal/consts.ts";
import { reconcilePaypalTransactionsForMonth } from "./treasurer/reconciliation.ts";
import { getStartAndEndDates, logger } from "./lib/utils/index.ts";

const { startDate, endDate } = getStartAndEndDates(10, 2024);

logger.info(
  `Reconciling PayPal transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
);

await reconcilePaypalTransactionsForMonth(startDate, endDate);

// const balanceService = await getBalancesSingleton(
//   PAYPAL_CLIENT_ID,
//   PAYPAL_SECRET,
// )

// const balances = await balanceService.get(endDate);

// console.log(balances);
