import { getTransactionSingleton } from "./transaction.ts";
import { formatMoney, isIterable } from "../utils/index.ts";
import logger from "../utils/index.ts";
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "./consts.ts";
import { displaySummary, generateCSV, type ItemSummary } from "./report.ts";

export const reconcilePaypalTransactionsForMonth = async (
  startDate: Date,
  endDate: Date,
) => {
  const transClient = await getTransactionSingleton(
    PAYPAL_CLIENT_ID,
    PAYPAL_SECRET,
  );

  const trans = await transClient.search({
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    fields: "all",
  });

  const UNKNOWN = "unknown";
  const SHIPPING = "shipping";
  const totalTemplate: { [key: string]: ItemSummary } = {};
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
  let withdrawalTotal = 0;
  let refundsTotal = 0;
  let shippingTotal = 0;

  const itemTotals = { ...totalTemplate };
  const refundItemTotals = { ...totalTemplate };

  // Event codes https://developer.paypal.com/docs/transaction-search/transaction-event-codes/
  const normalTransType = ["T0005", "T0006"];
  const cardTransType = ["T0001"];
  const refundTransType = ["T1107"];
  const withdrawalTransType = ["T0403"];

  const allKnownTransTypes = [
    ...normalTransType,
    ...refundTransType,
    ...cardTransType,
    ...withdrawalTransType,
  ];

  for (const tran of trans) {
    if (tran.transactionInfo.transactionStatus === "P") {
      logger.debug(
        `Pending transaction: ${tran.transactionInfo.transactionId}`,
      );
      continue;
    }

    if (
      !allKnownTransTypes.includes(tran.transactionInfo.transactionEventCode)
    ) {
      logger.error(
        `Unknown transaction type: ${tran.transactionInfo.transactionId} ${tran.transactionInfo.transactionEventCode} ${tran.transactionInfo.transactionAmount.value}`,
      );
      continue;
    }

    // Count withdrawals and move on
    if (
      withdrawalTransType.includes(tran.transactionInfo.transactionEventCode)
    ) {
      withdrawalTotal += parseFloat(
        tran.transactionInfo.transactionAmount.value,
      );
      continue;
    }

    // Find out if it's a refund
    let isRefund = refundTransType.includes(
      tran.transactionInfo.transactionEventCode,
    );

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
          }
        }
      }
    }
  }

  itemTotals[SHIPPING]["total"] = shippingTotal;

  displaySummary({
    transTotal,
    feesTotal,
    refundsTotal,
    withdrawalTotal,
    shippingTotal,
    itemsValue: Object.keys(itemTotals).reduce(
      (acc, key) => acc + itemTotals[key]["total"],
      0,
    ),
    transactionCount: trans.length,
  });
  generateCSV(
    itemTotals,
    `items-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
  );
  generateCSV(
    refundItemTotals,
    `refunds-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
  );
};
