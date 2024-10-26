export const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") || "";
export const PAYPAL_SECRET = Deno.env.get("PAYPAL_SECRET") || "";

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  throw new Error("PayPal credentials not found");
}

export const CATEGORIES: { [key: string]: string } = {
  "Travel Tickets": "Travel",
  "Social Inclusion Donation": "Social Inclusion",
  "Member": "Membership",
  "Junior Blues Membership": "Junior Blues Membership",
  "Online Donation": "Donation",
  "Additional Postage Cost": "Shipping",
  "shipping": "Shipping",
  "unknown": "Miscellaneous",
};
