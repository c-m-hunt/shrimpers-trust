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

export const CATEGORIES: { [key: string]: string[] } = {
  "fees": ["Banking", "PayPal"],
  "Zettle fees": ["Banking", "Zettle"],
  "Travel Tickets": ["Travel"],
  "Social Inclusion Donation": ["Social Inclusion"],
  "Member": ["Membership"],
  "1 Year OAP/Student/Disabled": ["Membership"],
  "Online 1 Year Renewal": ["Membership"],
  "Online 3 Year Renewal": ["Membership"],
  "Junior Blues Membership": ["Junior Blues Membership"],
  "2 Year OAP/Student/Disabled": ["Membership"],
  "Online 2 Year Renewal": ["Membership"],
  "Life": ["Membership"],
  "Additional Postage Cost": ["Shipping", "PayPal"],
  "shipping": ["Shipping", "PayPal"],
  "unknown": ["Miscellaneous"],

  // Donations
  "Online Donation": ["Donation", "Online"],
  "Xmas Donation": ["Donation", "Xmas"],

  // Merchandise
  "Dereliction and Decline": ["Merchandise"],
  "Exclusive Shrimpers Trust Pen": ["Merchandise"],
  "Kevin Maher Scarf": ["Merchandise"],
  "Shrimpers Trust (old logo) Badge": ["Merchandise"],
  "The Team We Call United DVD": ["Merchandise"],
  "Pitch Invasion Print": ["Merchandise"],
  "New Shrimpers Trust Pin Badge": ["Merchandise"],
  "Coffee Mug": ["Merchandise"],
  "Commemorative Malta Tour Pin Badge": ["Merchandise"],
  "Fridge Magnet": ["Merchandise"],
  "Silver 'Sammy The Shrimp' Blue Spinel Cuff Links": ["Merchandise"],
  "Coasters (set of 4 SUFC Programmes)": ["Merchandise"],
  "Season Card Holder": ["Merchandise"],
  "Greetings Card": ["Merchandise"],
  "Shrimpers Trust (SUSCT) Pin Badge": ["Merchandise"],
  "Lanyard": ["Merchandise"],
  "Trolley Key Ring": ["Merchandise"],
  "Go West At Night": ["Merchandise"],
  "The Big Christmas Quiz - 2024": ["Merchandise", "Christmas Quiz"],
  "Christmas Quiz 2024": ["Merchandise", "Christmas Quiz"], // Zettle
  "Limited Edition 2015 Play-Off Winners Pin Badge": ["Merchandise"],
  "A Snowy Night In January": ["Merchandise", "Keith Bird"],
  "Spirit Of The North Bank": ["Merchandise", "Keith Bird"],
  "Keith Bird Print - Evening Kick Off": ["Merchandise", "Keith Bird"], // Zettle
  "Keith Bird Print - Record Attendance": ["Merchandise", "Keith Bird"], // Zettle
  "Keith Bird Print - Spirit of North Bank": ["Merchandise", "Keith Bird"], // Zettle
  "Beautiful Grounds": ["Merchandise", "Books"],
  "Christmas Draw 2024": ["Merchandise", "Christmas Draw"], // Zettle

  // Junior Blues merchandise
  "Junior Blues Scarf": ["Junior Blues", "Merchandise"],
  "Junior Blues Pop Socket": ["Junior Blues", "Merchandise"],
  "Junior Blues Pin Badge": ["Junior Blues", "Merchandise"],

  // Junior Blues events
  "Junior Blues Meet The Players Day - 2024": [
    "Junior Blues",
    "Meet the Players",
  ],
  "Junior Blues Christmas Party 2024": ["Junior Blues", "Xmas Party"],
  "Junior Blues Xmas Party": ["Junior Blues", "Xmas Party"],

  // Events
  "An Evening With 'Red Card' Roy McDonough": [
    "Events",
    "Red Card Roy McDonough",
  ],

  // Micky Steed
  "Micky Stead Donation": ["Events", "Micky Steed"],
  "A Match For Micky": ["Events", "Micky Steed"],
  "Online Donation for Micky Stead Benefit": ["Events", "Micky Steed"],
  "Micky  Stead Goods": ["Events", "Micky Steed"],
  "Micky Stead Goods": ["Events", "Micky Steed"],
};
