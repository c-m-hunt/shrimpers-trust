import {
  getTransactionSingleton
} from "./lib/paypal/transaction.ts";

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

console.log(trans);
console.log(trans.length)
