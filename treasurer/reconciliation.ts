import { getTransactionSingleton } from "../lib/paypal/transaction.ts";
import { areNumbersEqual, isIterable } from "../lib/utils/index.ts";
import { logger } from "../lib/utils/index.ts";
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "../lib/paypal/consts.ts";
import {
  displayDonationsSummary,
  displaySummary,
  displayTravelSummary,
  generateCSV,
  type ItemSummary,
  type ReportBalances,
} from "./report.ts";
import { getBalancesSingleton } from "../lib/paypal/balances.ts";
import {
  allKnownTransTypes,
  refundTransType,
  withdrawalTransType,
} from "./consts.ts";

const getStartAndEndDateBalance = async (
  startDate: Date,
  endDate: Date,
): Promise<ReportBalances> => {
  const balanceService = await getBalancesSingleton(
    PAYPAL_CLIENT_ID,
    PAYPAL_SECRET,
  );
  const startBalanceResp = await balanceService.get(startDate);
  const endBalanceResp = await balanceService.get(endDate);

  if (startBalanceResp.balances.length !== 1) {
    throw new Error("Unexpected number of balances returned");
  }
  if (endBalanceResp.balances.length !== 1) {
    throw new Error("Unexpected number of balances returned");
  }
  if (
    startBalanceResp.balances[0].currency !==
      endBalanceResp.balances[0].currency
  ) {
    throw new Error("Currency mismatch");
  }

  const startBalance = parseFloat(
    startBalanceResp.balances[0].totalBalance.value,
  );
  const endBalance = parseFloat(endBalanceResp.balances[0].totalBalance.value);

  return { startBalance, endBalance };
};

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

  let transTotal = 0;
  let feesTotal = 0;
  let withdrawalTotal = 0;
  let refundsTotal = 0;
  let shippingTotal = 0;
  let spendingTotal = 0;

  const UNKNOWN = "unknown";
  const SHIPPING = "shipping";
  const FEES = "fees";
  const summaryTemplate: ItemSummary = {
    total: 0,
    qty: 0,
  };

  const itemTotals: { [key: string]: ItemSummary } = {};
  itemTotals[UNKNOWN] = { ...summaryTemplate };
  itemTotals[SHIPPING] = { ...summaryTemplate };
  itemTotals[FEES] = { ...summaryTemplate };
  const refundItemTotals: { [key: string]: ItemSummary } = {};
  refundItemTotals[UNKNOWN] = { ...summaryTemplate };
  refundItemTotals[SHIPPING] = { ...summaryTemplate };
  refundItemTotals[FEES] = { ...summaryTemplate };
  const pendingTrans: { [key: string]: number } = {};

  let prevBalance: number | null = null;

  for (const tran of trans) {
    const transAmt = parseFloat(tran.transactionInfo.transactionAmount.value);
    const feeAmt = parseFloat(tran.transactionInfo?.feeAmount?.value) || 0;
    const currBalance = parseFloat(tran.transactionInfo?.endingBalance?.value);

    // Ignore pending transactions
    if (tran.transactionInfo.transactionStatus === "P") {
      pendingTrans[tran.transactionInfo.transactionId] = transAmt;
      logger.error(
        `Pending transaction: ${tran.transactionInfo.transactionId} - ${tran.transactionInfo.transactionAmount.value}`,
      );
      prevBalance = currBalance;
      continue;
    }

    // Ignore denied transactions
    if (tran.transactionInfo.transactionStatus === "D") {
      if (tran.transactionInfo.transactionId in pendingTrans) {
        delete pendingTrans[tran.transactionInfo.transactionId];
      }
      logger.warn(
        `Denied transaction: ${tran.transactionInfo.transactionId}`,
      );
      prevBalance = currBalance;
      continue;
    }

    // Ignore transactions that are not in the list of known types
    if (
      !allKnownTransTypes.includes(tran.transactionInfo.transactionEventCode)
    ) {
      logger.error(
        `Unknown transaction type: ${tran.transactionInfo.transactionId} ${tran.transactionInfo.transactionEventCode} ${tran.transactionInfo.transactionAmount.value}`,
      );
      continue;
    }

    // Check if the balance is correct
    if (
      prevBalance &&
      !areNumbersEqual(prevBalance + transAmt + feeAmt, currBalance)
    ) {
      logger.error(
        `Balance mismatch: ${tran.transactionInfo.transactionId} ${prevBalance} + ${transAmt} + ${feeAmt} != ${currBalance}`,
      );
    }

    prevBalance = currBalance;

    // Count withdrawals and move on
    if (
      withdrawalTransType.includes(tran.transactionInfo.transactionEventCode)
    ) {
      withdrawalTotal += transAmt;
      continue;
    }

    // Find out if it's a refund
    let isRefund = refundTransType.includes(
      tran.transactionInfo.transactionEventCode,
    );

    if (!isNaN(transAmt)) {
      transTotal += transAmt;
    } else {
      logger.debug(
        `Transaction amount not a number: ${tran.transactionInfo.transactionId}`,
      );
    }
    feesTotal += feeAmt;

    // Shipping is a separate line item
    const shippingAmt = parseFloat(tran.transactionInfo.shippingAmount?.value);
    if (!isNaN(shippingAmt)) {
      shippingTotal += shippingAmt;
    }

    // Add refunds to the total
    if (isRefund) {
      refundsTotal += transAmt;
    }

    // Purchases are negative transactions and not refunds
    if (transAmt < 0 && !isRefund) {
      isRefund = true;
      spendingTotal += transAmt;
      if (!isNaN(shippingAmt)) {
        shippingTotal -= shippingAmt;
      }
      logger.warn(`Purchase: ${tran.transactionInfo.transactionId}`);
      continue;
    }

    // Things like card payments don't have cart items
    if (Object.keys(tran.cartInfo).length === 0) {
      itemTotals[UNKNOWN]["total"] += transAmt;
      logger.warn(
        `No cart items: ${tran.transactionInfo.transactionId} ${transAmt}`,
      );
    }

    if (isIterable(tran.cartInfo.itemDetails)) {
      let itemNumber = 0;
      for (const item of tran.cartInfo.itemDetails) {
        itemNumber += 1;
        if (itemNumber > 1 && isRefund) {
          logger.debug(
            `Refund with ID ${tran.transactionInfo.transactionId} has multiple items`,
          );
          break;
        }

        const itemAmt = parseFloat(item.totalItemAmount?.value);
        const itemQty = parseInt(item.itemQuantity);

        if (isRefund) {
          // If there's no item name, use unknown
          item.itemName = item.itemName || UNKNOWN;
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
  refundItemTotals[FEES]["total"] = feesTotal;

  displaySummary({
    dateRange: {
      start: startDate,
      end: endDate,
    },
    balance: await getStartAndEndDateBalance(startDate, endDate),
    transTotal,
    feesTotal,
    refundsTotal,
    withdrawalTotal,
    shippingTotal,
    spendingTotal,
    itemsValue: Object.keys(itemTotals).reduce(
      (acc, key) => acc + itemTotals[key]["total"],
      0,
    ),
    transactionCount: trans.length,
    pendingValue: Object.values(pendingTrans).reduce(
      (acc, val) => acc + val,
      0,
    ),
  });

  const mergedItems = mergeItemsAndRefunds(itemTotals, refundItemTotals);

  displayTravelSummary(mergedItems);

  displayDonationsSummary(mergedItems);

  generateCSV(
    itemTotals,
    `in-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
  );
  generateCSV(
    refundItemTotals,
    `out-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
  );
  generateCSV(
    mergedItems,
    `total-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
  );
};

const mergeItemsAndRefunds = (
  items: { [key: string]: ItemSummary },
  refunds: { [key: string]: ItemSummary },
): { [key: string]: ItemSummary } => {
  const merged = structuredClone(items);
  for (const key of Object.keys(refunds)) {
    if (key in merged) {
      merged[key]["total"] += refunds[key]["total"];
      merged[key]["qty"] += refunds[key]["qty"];
    } else {
      merged[key] = refunds[key];
    }
  }
  return merged;
};
