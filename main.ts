import { getTransactionSingleton } from "./lib/paypal/transaction.ts";
import { isIterable } from "./utils/index.ts";

const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
const secret = Deno.env.get("PAYPAL_SECRET");

if (!clientId || !secret) {
  throw new Error("PayPal credentials not found");
}

const transClient = await getTransactionSingleton(
  clientId,
  secret,
  false,
  "v1",
);

transClient.baseUrl = "https://api-m.paypal.com";

const trans = await transClient.search({
  start_date: "2024-09-01T00:00:00Z",
  end_date: "2024-10-01T00:00:00Z",
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
  let isRefund = false;
  const transAmt = parseFloat(tran.transactionInfo.transactionAmount.value);
  if (!isNaN(transAmt)) {
    transTotal += transAmt;
  } else {
    console.log(tran.transactionInfo.transactionId);
  }
  const feeAmt = parseFloat(tran.transactionInfo?.feeAmount?.value);
  if (!isNaN(feeAmt)) {
    feesTotal += feeAmt;
  } else {
    console.log(tran.transactionInfo.transactionId);
  }

  const shippingAmt = parseFloat(tran.transactionInfo.shippingAmount?.value);
  if (!isNaN(shippingAmt)) {
    shippingTotal += shippingAmt;
  }

  // Refunds are negative
  if (transAmt < 0) {
    isRefund = true;
    refundsTotal += transAmt;
    console.log(tran.cartInfo.itemDetails.length);
  }

  // Things like card payments don't have cart items
  if (Object.keys(tran.cartInfo).length === 0) {
    itemTotals[UNKNOWN]["total"] += transAmt;
  }

  if (isIterable(tran.cartInfo.itemDetails)) {
    for (const item of tran.cartInfo.itemDetails) {
      const itemsToAdd = isRefund ? refundItemTotals : itemTotals;
      const itemAmt = parseFloat(item.totalItemAmount?.value);
      const itemQty = parseInt(item.itemQuantity);
      if (!isNaN(itemAmt)) {
        if (item.itemName in itemTotals) {
          itemsToAdd[item.itemName]["total"] += itemAmt;
          itemsToAdd[item.itemName]["qty"] += itemQty;
        } else {
          itemsToAdd[item.itemName] = {
            total: itemAmt,
            qty: 1,
          };
        }
      } else {
        console.log(tran.transactionInfo.transactionId);
        // itemsToAdd[UNKNOWN]["total"] += transAmt;
      }
    }
  }
  //   console.log(tran.transactionInfo.transactionId);
}

itemTotals[SHIPPING]["total"] = shippingTotal;

const itemsValue = Object.keys(itemTotals).reduce(
  (acc, key) => acc + itemTotals[key]["total"],
  0,
);

console.log("-------------------------");
console.log(`Total: ${transTotal}`);
console.log(`Fees: ${feesTotal}`);
console.log(`Shipping: ${shippingTotal}`);
console.log(`Refunds: ${refundsTotal}`);
console.log(`Transaction count: ${trans.length}`);
console.log("-------------------------");
console.log(`Item values: ${itemsValue}`);
console.log(`Items value minus refunds: ${itemsValue + refundsTotal}`);
console.log("-------------------------");
const items = Object.keys(itemTotals).sort();
for (const item of items) {
  console.log(
    `${item},, ${itemTotals[item]["total"]}, ${itemTotals[item]["qty"]}`,
  );
}
console.log("-------------------------");
const refundItem = Object.keys(refundItemTotals).sort();
for (const item of refundItem) {
  console.log(
    `${item},, ${refundItemTotals[item]["total"]}, ${
      refundItemTotals[item]["qty"]
    }`,
  );
}
