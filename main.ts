import { reconcilePaypalTransactionsForMonth } from "./lib/paypal/reconciliation.ts";
import { createDateFromMonth } from "./lib/utils/index.ts";

/**
 * AMEND START AND END DATE HERE
 */
const startDate = createDateFromMonth("8", "2024");
const endDate = createDateFromMonth("9", "2024");

console.log(startDate.toISOString());
console.log(endDate.toISOString());

await reconcilePaypalTransactionsForMonth(startDate, endDate);
