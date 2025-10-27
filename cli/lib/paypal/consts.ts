export const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") || "";
export const PAYPAL_SECRET = Deno.env.get("PAYPAL_SECRET") || "";

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  throw new Error("PayPal credentials not found");
}

export const CURRENCY = "GBP";

export const DEFAULT_PAGE_SIZE = 500;

// Event codes https://developer.paypal.com/docs/transaction-search/transaction-event-codes/
export const normalTransType = [
  "T0003", // Pre-approved Payment
  "T0005", // Direct Payment API
  "T0006", // PayPal Checkout APIs
  "T0007", // Website Payments Standard Payment
];
export const cardTransType = ["T0001"]; // MassPay Payment
export const feeTransType = [
  "T0106", // Chargeback Processing Fee
  "T1108", // Fee Reversal
]; // Chargeback and chargeback processing fee, T1108 - fee reversal
export const virtualTerminalTransType = ["T0012"]; // Virtual Terminal Payment
export const refundTransType = [
  "T1107", // Payment Refund
  "T1201", // Chargeback
  "T1202", // Chargeback Reversal
]; // Refund and chargeback
export const otherTransType = [
  "T0013", // Donation Payment
  "T1105", // Release of Funds
];
export const withdrawalTransType = [
  "T0400", // General Withdrawal from PayPal Account
  "T0403", // Transfer from PayPal Balance to Bank Account
];

export const allKnownTransTypes = [
  ...normalTransType,
  ...virtualTerminalTransType,
  ...refundTransType,
  ...feeTransType,
  ...cardTransType,
  ...withdrawalTransType,
  ...otherTransType,
];
