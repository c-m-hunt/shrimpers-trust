import {
  ZETTLE_CLIENT_ID,
  ZETTLE_FEE,
  ZETTLE_SECRET,
} from "../lib/zettle/consts.ts";
import { Purchase } from "../lib/zettle/purchase.ts";
import { formatMoney } from "../lib/utils/index.ts";

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
  console.log("-------------------------------------");
  console.log(`Start Date: ${startDate.toDateString()}`);
  console.log(`End Date: ${endDate.toDateString()}`);
  console.log("-------------------------------------");
  console.log(`Total Transactions: ${purchases.length}`);
  console.log(`Total: ${formatMoney(totalAmount)}`);
  console.log(`Fees: ${formatMoney(totalFees)}`);
  console.log(`Net: ${formatMoney(totalAmount - totalFees)}`);
  console.log("-------------------------------------");
  for (const key in productTotals) {
    console.log(
      `${productNames[key]}: ${productCount[key]} ${
        formatMoney(productTotals[key])
      } - ${productCategories[key]}`,
    );
  }
  // logger.info(JSON.stringify(productTotals, null, 2));
  // logger.info(JSON.stringify(productNames, null, 2));
  // logger.info(JSON.stringify(productCategories, null, 2));
};
