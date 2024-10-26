import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts";

import { reconcilePaypalTransactionsForMonth } from "./lib/paypal/reconciliation.ts";
import logger, {
  createDateFromMonth,
  getStartAndEndDates,
} from "./lib/utils/index.ts";

await new Command()
  .name("st")
  .version("0.1.0")
  .description("Shrimpers Trust tooling")
  //----------------------------------------------------------------
  .command("actsum", "Account summary for a month. Takes in month and year")
  .arguments("<month:number> <year:number>")
  .action(async (_options, ...args) => {
    const { startDate, endDate } = getStartAndEndDates(args[0], args[1]);
    logger.info(
      `Reconciling PayPal transactions for ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    await reconcilePaypalTransactionsForMonth(startDate, endDate);
  })
  //----------------------------------------------------------------
  .parse(Deno.args);
