import {
  ZETTLE_CLIENT_ID,
  ZETTLE_FEE,
  ZETTLE_SECRET,
} from "../lib/zettle/consts.ts";
import { Purchase } from "../lib/zettle/purchase.ts";
import { displayCardSummary, generateCSV } from "./report.ts";
import { ItemSummary } from "./types.ts";

export const reconcileZettlePurchases = async (
  startDate: Date,
  endDate: Date,
): Promise<void> => {
  const zPurch = new Purchase(ZETTLE_CLIENT_ID, ZETTLE_SECRET);

  const purchases = await zPurch.getPurchases({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  let totalAmount = 0;
  let totalFees = 0;
  const totalTransactions = purchases.length;
  const productTotals: { [key: string]: number } = {};
  const productCount: { [key: string]: number } = {};
  const productNames: { [key: string]: string } = {};
  const productCategories: { [key: string]: string } = {};

  for (const purch of purchases) {
    const transFee = Math.round(purch.payments[0].amount * ZETTLE_FEE);
    totalFees += transFee;
    for (const item of purch.products) {
      const itemValue = item.grossValue / 100;
      const id = item.productUuid || item.name;
      const count = parseInt(item.quantity);
      if (productTotals[id]) {
        productTotals[id] += itemValue;
        productCount[id] += count;
      } else {
        productTotals[id] = itemValue;
        productNames[id] = item.name;
        productCategories[id] = item.category?.name || "Uncategorized";
        productCount[id] = count;
      }
      totalAmount += itemValue;
    }
  }
  totalFees = totalFees / 100;
  displayCardSummary({
    totalTransactions,
    totalAmount,
    totalFees,
    productTotals,
    productCount,
    productNames,
    productCategories,
  });

  const itemSummary: { [key: string]: ItemSummary } = {};
  for (const key in productTotals) {
    itemSummary[productNames[key]] = {
      total: productTotals[key],
      qty: productCount[key],
      category: productCategories[key],
    };
  }

  generateCSV(
    itemSummary,
    `total-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
    true,
  );
};
