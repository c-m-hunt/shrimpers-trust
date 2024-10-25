import { getTransactionSingleton } from "./transaction.ts";
import { formatMoney, isIterable } from "../utils/index.ts";
import logger from "../utils/index.ts";

const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
const secret = Deno.env.get("PAYPAL_SECRET");

if (!clientId || !secret) {
  throw new Error("PayPal credentials not found");
}

export const reconcilePaypalTransactionsForMonth = async (
  startDate: Date,
  endDate: Date,
) => {
  const transClient = await getTransactionSingleton(
    clientId,
    secret,
    false,
    "v1",
  );

  transClient.baseUrl = "https://api-m.paypal.com";

  const trans = await transClient.search({
    start_date: startDate.toISOString(), // "2024-09-01T00:00:00Z",
    end_date: endDate.toISOString(), //"2024-10-01T00:00:00Z",
    fields: "all",
  });

  // console.log(trans);
  // console.log(trans.length)
  const UNKNOWN = "unknown";
  const SHIPPING = "shipping";
  const totalTemplate: any = {};
  totalTemplate[UNKNOWN] = {
    total: 0,
    qty: 0,
  };
  totalTemplate[SHIPPING] = {
    total: 0,
    qty: 0,
  };

  let transTotal = 0;
  let feesTotal = 0;
  let refundsTotal = 0;
  let shippingTotal = 0;

  const itemTotals: any = { ...totalTemplate };
  const refundItemTotals: any = { ...totalTemplate };

  // Item 61

  for (const tran of trans) {
    if (tran.transactionInfo.transactionStatus === "P") {
      logger.debug(
        `Pending transaction: ${tran.transactionInfo.transactionId}`,
      );
      continue;
    }

    let isRefund = false;
    const transAmt = parseFloat(tran.transactionInfo.transactionAmount.value);
    if (!isNaN(transAmt)) {
      transTotal += transAmt;
    } else {
      logger.debug(
        `Transaction amount not a number: ${tran.transactionInfo.transactionId}`,
      );
    }
    const feeAmt = parseFloat(tran.transactionInfo?.feeAmount?.value);
    if (!isNaN(feeAmt)) {
      feesTotal += feeAmt;
    } else {
      logger.debug(
        `Fee amount not a number: ${tran.transactionInfo.transactionId}`,
      );
    }

    const shippingAmt = parseFloat(tran.transactionInfo.shippingAmount?.value);
    if (!isNaN(shippingAmt)) {
      shippingTotal += shippingAmt;
    }

    // Refunds are negative
    if (transAmt < 0) {
      isRefund = true;
      refundsTotal += transAmt;
    }

    // Things like card payments don't have cart items
    if (Object.keys(tran.cartInfo).length === 0) {
      console.log("No cart info");
      console.log(transAmt);
      console.log(tran.transactionInfo.transactionId);
      console.log("---------------");
      itemTotals[UNKNOWN]["total"] += transAmt;
    }

    if (isIterable(tran.cartInfo.itemDetails)) {
      for (const item of tran.cartInfo.itemDetails) {
        const itemAmt = parseFloat(item.totalItemAmount?.value);
        const itemQty = parseInt(item.itemQuantity);

        if (isRefund) {
          if (item.itemName in refundItemTotals) {
            refundItemTotals[item.itemName]["total"] += transAmt;
            refundItemTotals[item.itemName]["qty"] += 1;
          } else {
            refundItemTotals[item.itemName] = {
              total: transAmt,
              qty: 1,
            };
          }
        } else {
          if (!isNaN(itemAmt)) {
            if (item.itemName in itemTotals) {
              itemTotals[item.itemName]["total"] += itemAmt;
              itemTotals[item.itemName]["qty"] += itemQty;
            } else {
              itemTotals[item.itemName] = {
                total: itemAmt,
                qty: 1,
              };
            }
          } else {
            logger.debug(
              `Item amount not a number: ${tran.transactionInfo.transactionId}`,
            );
            // itemsToAdd[UNKNOWN]["total"] += transAmt;
          }
        }
      }
    }
  }

  itemTotals[SHIPPING]["total"] = shippingTotal;

  const itemsValue = Object.keys(itemTotals).reduce(
    (acc, key) => acc + itemTotals[key]["total"],
    0,
  );

  console.log("------------------------------------------------------------");
  console.log(`Total:                          ${formatMoney(transTotal)}`);
  console.log(`Fees:                           ${formatMoney(feesTotal)}`);
  console.log(`Shipping:                       ${formatMoney(shippingTotal)}`);
  console.log(`Refunds:                        ${formatMoney(refundsTotal)}`);
  console.log(`Transaction count:              ${trans.length}`);
  console.log("------------------------------------------------------------");
  console.log(`Item values:                    ${formatMoney(itemsValue)}`);
  console.log(
    `Items value minus refunds:      ${formatMoney(itemsValue + refundsTotal)}`,
  );
  console.log("------------------------------------------------------------");
  const items = Object.keys(itemTotals).sort();
  for (const item of items) {
    console.log(
      `${item},, ${itemTotals[item]["total"]}, ${itemTotals[item]["qty"]}`,
    );
  }
  console.log("------------------------------------------------------------");
  const refundItem = Object.keys(refundItemTotals).sort();
  for (const item of refundItem) {
    console.log(
      `${item},, ${refundItemTotals[item]["total"]}, ${
        refundItemTotals[item]["qty"]
      }`,
    );
  }
};
