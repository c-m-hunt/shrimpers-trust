import { areNumbersEqual, formatMoney } from "../lib/utils/index.ts";
import { Table } from "https://deno.land/x/cliffy@v1.0.0-rc.4/table/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts";
import { CATEGORIES } from "../lib/paypal/consts.ts";
import { OUTPUT_PATH } from "./consts.ts";
import { CardSummary, ItemSummary, SummaryData } from "./types.ts";

const header = colors.bold.brightWhite;
const total = colors.bold.brightCyan;
const error = colors.bold.red;
const success = colors.bold.green;
const warn = colors.bold.yellow;

try {
  Deno.mkdirSync(OUTPUT_PATH);
} catch (_err) {
  // Directory already exists
}

export const generateCSV = (
  data: { [key: string]: ItemSummary },
  title: string,
  append: boolean = false,
): void => {
  const items = Object.keys(data).sort();
  const lines = append ? ["Item,Category,Value,Count"] : [];
  for (const item of items) {
    const category = data[item].category || getCategory(item);
    lines.push(
      `${item},${category}, ${data[item]["total"]}, ${data[item]["qty"]}`,
    );
  }
  Deno.writeFileSync(
    `${OUTPUT_PATH}/${title}.csv`,
    new TextEncoder().encode(lines.join("\n")),
    { append },
  );
};

export const validateSummary = (summary: SummaryData) => {
  console.log(header("----------------------------------------"));
  console.log(header("Validating summary"));
  console.log(header("----------------------------------------"));
  if (
    !areNumbersEqual(
      summary.transTotal,
      summary.itemsValue + summary.refundsTotal + summary.spendingTotal +
        summary.cardTotal,
    )
  ) {
    console.log(
      error("Total doesn't match items value plus refunds and card purchases"),
    );
  } else {
    console.log(
      success("Total matches items value plus refunds and card purchases"),
    );
  }

  const balanceDiff = summary.balance.endBalance - summary.balance.startBalance;

  const grandTotal = summary.transTotal + summary.feesTotal +
    summary.withdrawalTotal;
  if (
    !areNumbersEqual(balanceDiff, grandTotal)
  ) {
    if (areNumbersEqual(balanceDiff, grandTotal + summary.pendingValue)) {
      console.log(
        warn(
          "Balance difference matches transactions plus fees plus pending",
        ),
      );
    } else {
      console.log(
        error("Balance difference doesn't match transactions plus fees"),
      );
    }
  } else {
    console.log(success("Balance difference matches transactions plus fees"));
  }
  console.log(header("----------------------------------------"));
};

export const displaySummary = (summary: SummaryData) => {
  const grandTotal = parseFloat(
    (summary.transTotal + summary.feesTotal + summary.withdrawalTotal).toFixed(
      2,
    ),
  );
  console.log("----------------------------------------");
  const balanceTable = new Table()
    .body([
      [
        "Start balance",
        summary.dateRange.start.toDateString(),
        formatMoney(summary.balance.startBalance),
      ],
      [
        "End balance",
        summary.dateRange.end.toDateString(),
        formatMoney(summary.balance.endBalance),
      ],
      [
        total("Difference"),
        ,
        total(
          formatMoney(
            summary.balance.endBalance - summary.balance.startBalance,
          ),
        ),
      ],
    ]).padding(7);
  console.log(balanceTable.toString());
  console.log("----------------------------------------");
  const table = new Table()
    .body([
      ["Total", formatMoney(summary.transTotal)],
      ["Fees", formatMoney(summary.feesTotal)],
      ["Withdrawals", formatMoney(summary.withdrawalTotal)],
      [
        total("Total plus fees plus withdrawals"),
        total(
          formatMoney(grandTotal),
        ),
      ],
      [],
      ["Shipping", formatMoney(summary.shippingTotal)],
      ["Refunds", formatMoney(summary.refundsTotal)],
      ["Spending", formatMoney(summary.spendingTotal)],
      ["Pending", formatMoney(summary.pendingValue)],
      [],
      ["Transaction count", summary.transactionCount],
      [],
      ["Item values", formatMoney(summary.itemsValue)],
      [
        "Items value minus refunds",
        formatMoney(
          summary.itemsValue + summary.refundsTotal,
        ),
      ],
      [
        "Items value minus refunds minus fees",
        formatMoney(
          summary.itemsValue + summary.refundsTotal + summary.feesTotal,
        ),
      ],
    ])
    .padding(6);
  console.log(table.toString());
  console.log("----------------------------------------\n");
  validateSummary(summary);
};

const getCategory = (item: string): string => {
  let category = CATEGORIES[item];
  if (!category) {
    for (const key in CATEGORIES) {
      if (item.startsWith(key)) {
        category = CATEGORIES[key];
        break;
      }
    }
  }
  if (!category) {
    console.log(warn(`No category found for ${item}`));
  }
  return category || "";
};

export const displayTravelSummary = (items: { [key: string]: ItemSummary }) => {
  const travelItemsStartWith = "Travel Tickets for ";
  const travelItems = Object.keys(items).filter((item) =>
    item.startsWith(travelItemsStartWith)
  );

  const travelSummary: { [key: string]: ItemSummary } = {};

  for (const item of travelItems) {
    const newItem = item.replace(travelItemsStartWith, "").split(" - ").splice(
      0,
      2,
    ).join(" - ");
    if (newItem in travelSummary) {
      travelSummary[newItem]["total"] += items[item].total;
      travelSummary[newItem]["qty"] += items[item].qty;
    } else {
      travelSummary[newItem] = {
        total: items[item].total,
        qty: items[item].qty,
      };
    }
  }

  console.log("");
  console.log(header("----------------------------------------"));
  console.log(header("Travel summary"));
  console.log(header("----------------------------------------"));
  const travelTable = new Table()
    .body(
      Object.keys(travelSummary).map((
        item,
      ) => [item, formatMoney(travelSummary[item].total)]),
    )
    .padding(5);
  console.log(travelTable.toString());
};

export const displayDonationsSummary = (
  items: { [key: string]: ItemSummary },
) => {
  const donations = Object.keys(items).filter((item) =>
    item.toLowerCase().includes("donation")
  );

  console.log("");
  console.log(header("----------------------------------------"));
  console.log(header("Donations summary"));
  console.log(header("----------------------------------------"));
  const donationsTable = new Table()
    .body(
      donations.map((item) => [item, formatMoney(items[item].total)]),
    )
    .padding(5);
  console.log(donationsTable.toString());
};

export const displayCardSummary = (summary: CardSummary) => {
  console.log("");
  console.log(header("----------------------------------------"));
  console.log(header("Zettle summary"));
  console.log(header("----------------------------------------"));
  console.log(
    `Total Transactions                  ${summary.totalTransactions}`,
  );
  console.log(
    `Total                               ${formatMoney(summary.totalAmount)}`,
  );
  console.log(
    `Fees                                ${formatMoney(summary.totalFees)}`,
  );
  console.log(
    `Net                                 ${
      formatMoney(summary.totalAmount - summary.totalFees)
    }`,
  );
  console.log("----------------------------------------");
};
