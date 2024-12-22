import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts";
import { reconcileAndDisplayPaypalTransactionsForMonth } from "./treasurer/reconciliation.ts";
import { getStartAndEndDates, logger } from "./lib/utils/index.ts";
import { reconcileZettlePurchases } from "./treasurer/reconcileCardPurchases.ts";
import { setupApi } from "./lib/api/app.ts";
import { clearCache } from "./lib/cache/index.ts"; // Pba49

const treasurerCmd = await new Command()
  .description("Treasurer tooling")
  .command(
    "account-summary",
    "Account summary for a month. Takes in month and year",
  )
  .alias("as")
  .arguments("<month:number> <year:number>")
  .action(async (_options, ...args) => {
    const { startDate, endDate } = getStartAndEndDates(args[0], args[1]);
    logger.info(
      `Reconciling PayPal transactions for ${startDate.toDateString()} to ${endDate.toDateString()}`,
    );

    await reconcileAndDisplayPaypalTransactionsForMonth(startDate, endDate);
    await reconcileZettlePurchases(startDate, endDate);
  });

const apiCmd = await new Command()
  .description("API tooling")
  .command("start", "Start the API")
  .alias("s")
  .action(() => {
    logger.info("Starting API");
    setupApi();
  });

const cacheCmd = await new Command()
  .description("Cache tooling")
  .command("clear", "Clear the cache")
  .action(async () => {
    logger.info("Clearing cache");
    await clearCache();
    logger.info("Cache cleared successfully");
  });

await new Command()
  .name("st")
  .version("0.1.0")
  .description("Shrimpers Trust tooling")
  .command("treasurer", treasurerCmd)
  .command("api", apiCmd)
  .command("cache", cacheCmd)
  .parse(Deno.args);
