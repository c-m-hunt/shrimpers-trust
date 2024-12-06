export const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") || "";
export const PAYPAL_SECRET = Deno.env.get("PAYPAL_SECRET") || "";

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  throw new Error("PayPal credentials not found");
}

export const CURRENCY = "GBP";

export const DEFAULT_PAGE_SIZE = 500;

// Event codes https://developer.paypal.com/docs/transaction-search/transaction-event-codes/
export const normalTransType = ["T0003", "T0005", "T0006", "T0007"];
export const cardTransType = ["T0001"];
export const feeTransType = ["T0106"]; // Chargeback and chargeback processing fee
export const virtualTerminalTransType = ["T0012"];
export const refundTransType = ["T1107", "T1201"]; // Refund and chargeback
export const withdrawalTransType = ["T0403"];

export const allKnownTransTypes = [
  ...normalTransType,
  ...virtualTerminalTransType,
  ...refundTransType,
  ...feeTransType,
  ...cardTransType,
  ...withdrawalTransType,
];