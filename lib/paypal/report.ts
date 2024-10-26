import { formatMoney } from "../utils/index.ts";
import { CATEGORIES } from "./consts.ts";

type SummaryData = {
  transTotal: number;
  feesTotal: number;
  refundsTotal: number;
  shippingTotal: number;
  withdrawalTotal: number;
  transactionCount: number;
  itemsValue: number;
};

export type ItemSummary = {
  total: number;
  qty: number;
};

const currentDir = Deno.realPathSync(Deno.cwd());
const OUTPUT_PATH = `${currentDir}/output`;
export const generateCSV = (
  data: { [key: string]: ItemSummary },
  title: string,
): void => {
  const items = Object.keys(data).sort();
  const lines = [];
  for (const item of items) {
    lines.push(
      `${item},${getCategory(item)}, ${data[item]["total"]}, ${
        data[item]["qty"]
      }`,
    );
  }
  Deno.writeFileSync(
    `${OUTPUT_PATH}/${title}.csv`,
    new TextEncoder().encode(lines.join("\n")),
  );
};

export const displaySummary = (summary: SummaryData) => {
  console.log("------------------------------------------------------------");
  console.log(
    `Total:                          ${formatMoney(summary.transTotal)}`,
  );
  console.log(
    `Fees:                           ${formatMoney(summary.feesTotal)}`,
  );
  console.log(
    `Shipping:                       ${formatMoney(summary.shippingTotal)}`,
  );
  console.log(
    `Refunds:                        ${formatMoney(summary.refundsTotal)}`,
  );
  console.log(
    `Withdrawals:                    ${formatMoney(summary.withdrawalTotal)}`,
  );
  console.log(`Transaction count:              ${summary.transactionCount}`);
  console.log("------------------------------------------------------------");
  console.log(
    `Item values:                    ${formatMoney(summary.itemsValue)}`,
  );
  console.log(
    `Items value minus refunds:      ${
      formatMoney(summary.itemsValue + summary.refundsTotal)
    }`,
  );
  console.log("------------------------------------------------------------");
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
  return category || "";
};
