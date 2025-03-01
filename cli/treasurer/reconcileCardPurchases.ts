import {
  ZETTLE_CLIENT_ID,
  ZETTLE_FEE,
  ZETTLE_SECRET,
} from "../lib/zettle/consts.ts";
import { Purchase } from "../lib/zettle/purchase.ts";
import { displayCardSummary, generateCSV } from "./report.ts";
import { CardSummary, ItemSummary } from "./types.ts";

export const reconcileAndDisplayZettleTransactionsForMonth = async (
  startDate: Date,
  endDate: Date,
): Promise<void> => {
  const cardSummary = await reconcileZettlePurchases(startDate, endDate);
  displayCardSummary(cardSummary);
  generateCSV(
    "Zettle",
    endDate,
    cardSummary.itemSummary,
    `total-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
    true,
  );
};

export const reconcileZettlePurchases = async (
  startDate: Date,
  endDate: Date,
): Promise<CardSummary> => {
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
        productCategories[id] = item.category?.name || "";
        productCount[id] = count;
      }
      totalAmount += itemValue;
    }
  }
  totalFees = -1 * totalFees / 100;
  const itemSummary: { [key: string]: ItemSummary } = {
    "Zettle fees": { total: totalFees, qty: 1 },
  };
  for (const key in productTotals) {
    // Check if key exists in itemSummary
    if (itemSummary[productNames[key]]) {
      itemSummary[productNames[key]].total += productTotals[key];
      itemSummary[productNames[key]].qty += productCount[key];
      continue;
    }
    itemSummary[productNames[key]] = {
      total: productTotals[key],
      qty: productCount[key],
      category: productCategories[key],
    };
  }
  return {
    totalTransactions,
    totalAmount,
    totalFees,
    productTotals,
    productCount,
    productNames,
    productCategories,
    itemSummary,
  };
};
