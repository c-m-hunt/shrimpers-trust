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

const currentDir = Deno.realPathSync(Deno.cwd());
export const OUTPUT_PATH = `${currentDir}/output`;
