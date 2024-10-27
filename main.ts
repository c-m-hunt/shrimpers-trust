import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts";

import { reconcilePaypalTransactionsForMonth } from "./treasurer/reconciliation.ts";
import { getStartAndEndDates, logger } from "./lib/utils/index.ts";

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
      `Reconciling PayPal transactions for ${startDate.toDateString()} to ${endDate.toDateString()}`,
    );

    await reconcilePaypalTransactionsForMonth(startDate, endDate);
  })
  //----------------------------------------------------------------
  .parse(Deno.args);
