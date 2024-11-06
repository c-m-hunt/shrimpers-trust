export const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") || "";
export const PAYPAL_SECRET = Deno.env.get("PAYPAL_SECRET") || "";

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  throw new Error("PayPal credentials not found");
}

export const CURRENCY = "GBP";

export const DEFAULT_PAGE_SIZE = 500;

export const CATEGORIES: { [key: string]: string } = {
  "fees": "PayPal Fees",
  "Travel Tickets": "Travel",
  "Social Inclusion Donation": "Social Inclusion",
  "Member": "Membership",
  "Online 1 Year Renewal": "Membership",
  "Online 3 Year Renewal": "Membership",
  "Junior Blues Membership": "Junior Blues Membership",
  "2 Year OAP/Student/Disabled": "Membership",
  "Online 2 Year Renewal": "Membership",
  "Life": "Membership",
  "Additional Postage Cost": "Shipping",
  "shipping": "Shipping",
  "unknown": "Miscellaneous",

  // Donations
  "Online Donation": "Donation",
  "Xmas Donation": "Donation",

  // Merchandise
  "Dereliction and Decline": "Merchandise",
  "Exclusive Shrimpers Trust Pen": "Merchandise",
  "Kevin Maher Scarf": "Merchandise",
  "Shrimpers Trust (old logo) Badge": "Merchandise",
  "The Team We Call United DVD": "Merchandise",
  "Pitch Invasion Print": "Merchandise",
  "New Shrimpers Trust Pin Badge": "Merchandise",
  "Coffee Mug": "Merchandise",
  "Commemorative Malta Tour Pin Badge": "Merchandise",
  "Fridge Magnet": "Merchandise",
  "Silver 'Sammy The Shrimp' Blue Spinel Cuff Links": "Merchandise",
  "Coasters (set of 4 SUFC Programmes)": "Merchandise",
  "Season Card Holder": "Merchandise",
  "Greetings Card": "Merchandise",
  "Shrimpers Trust (SUSCT) Pin Badge": "Merchandise",
  "Lanyard": "Merchandise",
  "Trolley Key Ring": "Merchandise",

  // Junior Blues merchandise
  "Junior Blues Scarf": "Junior Blues Merchandise",
  "Junior Blues Pop Socket": "Junior Blues Merchandise",
  "Junior Blues Meet The Players Day - 2024": "Junior Blues Merchandise",
  "Junior Blues Pin Badge": "Junior Blues Merchandise",

  // Events
  "An Evening With 'Red Card' Roy McDonough": "Red Card Roy McDonough",

  // Micky Steed
  "Micky Stead Donation": "Micky Steed",
  "A Match For Micky": "Micky Steed",
  "Online Donation for Micky Stead Benefit": "Micky Steed",
};
