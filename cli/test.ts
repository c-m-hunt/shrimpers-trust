import { reconcilePaypalTransactionsForMonth } from "./treasurer/reconciliation.ts";
import { getStartAndEndDates, logger } from "./lib/utils/index.ts";
import { reconcileZettlePurchases } from "./treasurer/reconcileCardPurchases.ts";
import { sendPasswordResetEmail } from "./lib/utils/email.ts";

// const { startDate, endDate } = getStartAndEndDates(10, 2024);

// logger.info(
//   `Reconciling PayPal transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
// );

// await reconcilePaypalTransactionsForMonth(startDate, endDate);
// await reconcileZettlePurchases(startDate, endDate);


await sendPasswordResetEmail("chris.hunt1977@gmail.com", "Chris", "chris.hunt1977", "password");