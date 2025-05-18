import {
  getOrderSingleton,
  getTransactionSingleton,
} from "../lib/paypal/transaction.ts";
import { areNumbersEqual, isIterable } from "../lib/utils/index.ts";
import { logger } from "../lib/utils/index.ts";
import {
  allKnownTransTypes,
  feeTransType,
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  refundTransType,
  withdrawalTransType,
} from "../lib/paypal/consts.ts";
import {
  displayDonationsSummary,
  displaySummary,
  displayTravelSummary,
  generateCSV,
} from "./report.ts";
import { getBalancesSingleton } from "../lib/paypal/balances.ts";

import {
  AccountMessage,
  ItemSummary,
  ItemSummaryMap,
  MessageType,
  ReportBalances,
  SummaryData,
} from "./types.ts";

const getStartAndEndDatePaypalBalance = async (
  startDate: Date,
  endDate: Date
): Promise<ReportBalances> => {
  const balanceService = await getBalancesSingleton(
    PAYPAL_CLIENT_ID,
    PAYPAL_SECRET
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
    startBalanceResp.balances[0].totalBalance.value
  );
  const endBalance = parseFloat(endBalanceResp.balances[0].totalBalance.value);

  return { startBalance, endBalance };
};

export const reconcileAndDisplayPaypalTransactionsForMonth = async (
  startDate: Date,
  endDate: Date
) => {
  const reconciledData = await reconcilePaypalTransactionsForMonth(
    startDate,
    endDate
  );
  displayReconciliationSummary(reconciledData);
};

const logMessage = (
  msg: string,
  transactionId: string,
  type: MessageType,
  messageList: AccountMessage[]
) => {
  logger[type](msg);
  messageList.push({
    transactionId,
    message: msg,
    type,
  });
  return messageList;
};

export const reconcilePaypalTransactionsForMonth = async (
  startDate: Date,
  endDate: Date
): Promise<SummaryData> => {
  let accountMessages: AccountMessage[] = [];

  const transClient = await getTransactionSingleton(
    PAYPAL_CLIENT_ID,
    PAYPAL_SECRET
  );

  const orderClient = await getOrderSingleton(PAYPAL_CLIENT_ID, PAYPAL_SECRET);

  const trans = await transClient.search({
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    fields: "all",
  });

  let transTotal = 0;
  let feesTotal = 0;
  let chargebackTotal = 0;
  let withdrawalTotal = 0;
  let refundsTotal = 0;
  let shippingTotal = 0;
  let spendingTotal = 0;
  let cardTotal = 0;

  const UNKNOWN = "unknown";
  const SHIPPING = "shipping";
  const FEES = "fees";
  const WITHDRAWALS = "withdrawals";
  const summaryTemplate: ItemSummary = {
    total: 0,
    qty: 0,
  };

  const itemTotals: ItemSummaryMap = {};
  itemTotals[UNKNOWN] = { ...summaryTemplate };
  itemTotals[SHIPPING] = { ...summaryTemplate };
  itemTotals[FEES] = { ...summaryTemplate };
  const refundItemTotals: ItemSummaryMap = {};
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

      accountMessages = logMessage(
        `Pending transaction: ${tran.transactionInfo.transactionId} - ${tran.transactionInfo.transactionAmount.value}`,
        tran.transactionInfo.transactionId,
        "error",
        accountMessages
      );
      prevBalance = currBalance;
      continue;
    }

    // Ignore denied transactions
    if (tran.transactionInfo.transactionStatus === "D") {
      if (tran.transactionInfo.transactionId in pendingTrans) {
        delete pendingTrans[tran.transactionInfo.transactionId];
      }
      accountMessages = logMessage(
        `Denied transaction: ${tran.transactionInfo.transactionId}`,
        tran.transactionInfo.transactionId,
        "warn",
        accountMessages
      );
      prevBalance = currBalance;
      continue;
    }

    // Ignore transactions that are not in the list of known types
    if (
      !allKnownTransTypes.includes(tran.transactionInfo.transactionEventCode)
    ) {
      accountMessages = logMessage(
        `Unknown transaction type: ${tran.transactionInfo.transactionId} ${tran.transactionInfo.transactionEventCode} ${tran.transactionInfo.transactionAmount.value}`,
        tran.transactionInfo.transactionId,
        "error",
        accountMessages
      );
      continue;
    }

    // Check if the balance is correct
    if (
      prevBalance &&
      !areNumbersEqual(prevBalance + transAmt + feeAmt, currBalance)
    ) {
      accountMessages = logMessage(
        `Balance mismatch: ${tran.transactionInfo.transactionId} ${prevBalance} + ${transAmt} + ${feeAmt} != ${currBalance}`,
        tran.transactionInfo.transactionId,
        "error",
        accountMessages
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
      tran.transactionInfo.transactionEventCode
    );

    if (!isNaN(transAmt)) {
      transTotal += transAmt;
    } else {
      accountMessages = logMessage(
        `Transaction amount not a number: ${tran.transactionInfo.transactionId}`,
        tran.transactionInfo.transactionId,
        "debug",
        accountMessages
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

    if (feeTransType.includes(tran.transactionInfo.transactionEventCode)) {
      chargebackTotal += transAmt;
      accountMessages = logMessage(
        `Chargeback: ${tran.transactionInfo.transactionId} ${transAmt}`,
        tran.transactionInfo.transactionId,
        "warn",
        accountMessages
      );
      continue;
    }

    // Purchases are negative transactions and not refunds
    if (transAmt < 0 && !isRefund) {
      isRefund = true;
      spendingTotal += transAmt;
      if (!isNaN(shippingAmt)) {
        shippingTotal -= shippingAmt;
      }
      accountMessages = logMessage(
        `Purchase: ${tran.transactionInfo.transactionId} ${transAmt}`,
        tran.transactionInfo.transactionId,
        "warn",
        accountMessages
      );
      continue;
    }

    // Things like card payments don't have cart items
    if (Object.keys(tran.cartInfo).length === 0) {
      if (tran.payerInfo.payerName.alternateFullName === "PP Zettle") {
        cardTotal += transAmt;
      } else {
        console.log(tran.payerInfo);
        itemTotals[UNKNOWN]["total"] += transAmt;
        accountMessages = logMessage(
          `No cart items: ${tran.transactionInfo.transactionId} ${transAmt}`,
          tran.transactionInfo.transactionId,
          "warn",
          accountMessages
        );
      }
    }

    const includedNumbers: Array<string> = [];

    if (isIterable(tran.cartInfo.itemDetails)) {
      let itemNumber = 0;
      for (const item of tran.cartInfo.itemDetails) {
        itemNumber += 1;
        if (itemNumber > 1 && isRefund) {
          accountMessages = logMessage(
            `Refund with ID ${tran.transactionInfo.transactionId} has multiple items`,
            tran.transactionInfo.transactionId,
            "debug",
            accountMessages
          );
          break;
        }

        const itemAmt = parseFloat(item.totalItemAmount?.value);
        const itemQty = parseInt(item.itemQuantity);

        // ------------------
        // Prints the list of puraches of specific object
        // ------------------
        if (item.itemName.startsWith("Travel Tickets for ROCHDALE AFC")) {
          // const paymentDetails = await orderClient.getPaymentDetails(
          //   tran.transactionInfo.paypalReferenceId
          // );
          // const orderDetails = await orderClient.getOrderDetails(
          //   paymentDetails["supplementaryData"]["relatedIds"]["orderId"]
          // );
          // console.log(
          //   `${tran.transactionInfo.transactionInitiationDate},${
          //     tran.payerInfo.payerName.alternateFullName
          //   },${tran.payerInfo.emailAddress || ""},${
          //     paymentDetails["payee"]["emailAddress"] || ""
          //   }, ${item.itemAmount?.value}`
          // );
          // console.log(
          //   `${tran.transactionInfo.transactionInitiationDate},${
          //     tran.payerInfo.payerName.alternateFullName
          //   },${tran.payerInfo.emailAddress || ""},${item.itemAmount?.value}`
          // );
          if (tran.payerInfo.phoneNumber) {
            const phoneNuber =
              tran.payerInfo.phoneNumber?.countryCode +
              tran.payerInfo.phoneNumber?.nationalNumber.substring(1);

            if (
              !includedNumbers.includes(phoneNuber) &&
              tran.payerInfo.phoneNumber?.nationalNumber.substring(1, 2) == "7"
            ) {
              // console.log(
              //   `,${tran.payerInfo.payerName.alternateFullName.split(" ")[0]},${
              //     tran.payerInfo.payerName.alternateFullName.split(" ")[1] || ""
              //   },${phoneNuber},`
              // );
              includedNumbers.push(phoneNuber);
            }
          } else {
            console.log(
              `${tran.payerInfo.payerName.alternateFullName},${
                tran.payerInfo.emailAddress || ""
              }`
            );
          }
        }

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
            accountMessages = logMessage(
              `Item amount not a number: ${tran.transactionInfo.transactionId}`,
              tran.transactionInfo.transactionId,
              "debug",
              accountMessages
            );
          }
        }
      }
    }
  }

  itemTotals[SHIPPING]["total"] = shippingTotal;
  refundItemTotals[FEES]["total"] = feesTotal + chargebackTotal;

  refundItemTotals[WITHDRAWALS] = { total: withdrawalTotal, qty: 1 };

  return {
    dateRange: {
      start: startDate,
      end: endDate,
    },
    balance: await getStartAndEndDatePaypalBalance(startDate, endDate),
    transTotal,
    feesTotal,
    chargebackTotal,
    refundsTotal,
    withdrawalTotal,
    shippingTotal,
    spendingTotal,
    cardTotal,
    itemsValue: Object.keys(itemTotals).reduce(
      (acc, key) => acc + itemTotals[key]["total"],
      0
    ),
    transactionCount: trans.length,
    pendingValue: Object.values(pendingTrans).reduce(
      (acc, val) => acc + val,
      0
    ),
    itemTotals,
    refundItemTotals,
    messages: accountMessages,
  };
};

const displayReconciliationSummary = (summary: SummaryData) => {
  const { itemTotals, refundItemTotals } = summary;
  const { start: startDate, end: endDate } = summary.dateRange;
  const mergedItems = mergeItemsAndRefunds(itemTotals, refundItemTotals);

  displaySummary(summary);

  displayTravelSummary(mergedItems);

  displayDonationsSummary(mergedItems);

  generateCSV(
    "PayPal",
    endDate,
    itemTotals,
    `in-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
  );
  generateCSV(
    "PayPal",
    endDate,
    refundItemTotals,
    `out-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
  );
  generateCSV(
    "PayPal",
    endDate,
    mergedItems,
    `total-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
  );
};

const mergeItemsAndRefunds = (
  items: { [key: string]: ItemSummary },
  refunds: { [key: string]: ItemSummary }
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
