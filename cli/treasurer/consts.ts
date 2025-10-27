const currentDir = Deno.realPathSync(Deno.cwd());
export const OUTPUT_PATH = `${currentDir}/output`;

export const CATEGORIES: { [key: string]: string[] } = {
  fees: ["Banking", "PayPal"],
  withdrawal: ["Banking", "Transfer"],
  "Zettle fees": ["Banking", "Zettle"],
  "Travel Tickets": ["Travel"],
  "Social Inclusion Donation": ["Social Inclusion"],

  // Membership
  Member: ["Membership"],
  "1 Year Membership": ["Membership"],
  "2 Year Membership": ["Membership"],
  "3 Year Membership": ["Membership"],
  "1 Year OAP/Student/Disabled": ["Membership"],
  "Online 1 Year Renewal": ["Membership"],
  "Online 3 Year Renewal": ["Membership"],
  "Junior Blues Membership": ["Junior Blues", "Membership"],
  "Junior Blue Membership": ["Junior Blues", "Membership"],
  "Junior Blue Membership (Sibling Discount)": ["Junior Blues", "Membership"],
  "2 Year OAP/Student/Disabled": ["Membership"],
  "Online 2 Year Renewal": ["Membership"],
  Life: ["Membership"],
  "3 Year Adult Membership - Email": ["Membership"],
  "Junior Blues - Membership": ["Junior Blues", "Membership"],
  "1 Year Junior Blue Membership": ["Junior Blues", "Membership"],
  "2 Year Adult Membership - Email": ["Membership"],

  "Additional Postage Cost": ["Expenses", "Shipping"],
  shipping: ["Expenses", "Shipping"],
  unknown: ["Miscellaneous"],

  // Donations
  "Online Donation": ["Donation", "Online"],

  // Merchandise
  "Dereliction and Decline": ["Merchandise"],
  "Exclusive Shrimpers Trust Pen": ["Merchandise"],
  "Kevin Maher Scarf": ["Merchandise"],
  "Shrimpers Trust (old logo) Badge": ["Merchandise"],
  "The Team We Call United DVD": ["Merchandise"],
  "Team We Call United DVD": ["Merchandise"], // Zettle
  "Pitch Invasion Print": ["Merchandise"],
  "New Shrimpers Trust Pin Badge": ["Merchandise"],
  Badge: ["Merchandise"], // Zettle
  "Coffee Mug": ["Merchandise"],
  "Commemorative Malta Tour Pin Badge": ["Merchandise"],
  "Fridge Magnet": ["Merchandise"],
  "Silver 'Sammy The Shrimp' Blue Spinel Cuff Links": ["Merchandise"],
  "Coasters (set of 4 SUFC Programmes)": ["Merchandise"],
  "Coasters  (set of 4)": ["Merchandise"], // Zettle
  "Season Card Holder": ["Merchandise"],
  "Greetings Card": ["Merchandise"],
  "Shrimpers Trust (SUSCT) Pin Badge": ["Merchandise"],
  Lanyard: ["Merchandise"],
  "Trolley Key Ring": ["Merchandise"],
  "Go West At Night": ["Merchandise"],
  "Navy/Royal Blue Polo Shirt - Medium": ["Merchandise"],
  "1 x Season Card Holder plus Postage to Spain": ["Merchandise"],
  "Limited Edition 2015 Play-Off Winners Pin Badge": ["Merchandise"],
  "A Snowy Night In January": ["Merchandise", "Keith Bird"],
  "Spirit Of The North Bank": ["Merchandise", "Keith Bird"],
  "Blue Voice Pin Badge": ["Merchandise"],
  "Legends Are Forever Print": ["Merchandise"],
  "Limited Edition 2005 Play Off Winners Pin Badge": ["Merchandise"],
  "Limited Edition 2004 LDV Pin Badge": ["Merchandise"],
  "Limited Edition 2005 LDV Pin Badge": ["Merchandise"],
  "Limited Edition 2013 JPT Final Pin Badge": ["Merchandise"],
  "Limited Edition Champions 2005/2006 Pin Badge": ["Merchandise"],
  "Shrimpers Trust Year Badge": ["Merchandise"],
  "Once Upon A Time In Malta": ["Merchandise"],
  "Half-time In The West Stand Print": ["Merchandise", "Keith Bird"],
  "The Scoreboards Finest Hour": ["Merchandise", "Keith Bird"],
  "West Stand Print": ["Merchandise", "Keith Bird"],
  "Drawstring Bag (old)": ["Merchandise"],
  "Roots & All": ["Merchandise", "Roots & All"],
  "2 x Roots & All Books including Postage & Packing to Malta": [
    "Merchandise",
    "Roots & All",
  ],
  "2 x Roots & All Books including Postage & Packing to Australia": [
    "Merchandise",
    "Roots & All",
  ],
  "1 x Roots & All Books including Postage & Packing to Australia": [
    "Merchandise",
    "Roots & All",
  ],
  "2 x Roots and All Books including International Postage": [
    "Merchandise",
    "Roots & All",
  ],
  "Roots & all": ["Merchandise", "Roots & All"], // Zettle
  "Shrimpers Heritage - Series 1 (UK Postage)": [
    "Merchandise",
    "Shrimpers Heritage",
  ],
  "Shrimpers Heritage Series 1": ["Merchandise", "Shrimpers Heritage"],
  "Keith Bird Print - Evening Kick Off": ["Merchandise", "Keith Bird"], // Zettle
  "Keith Bird Print - Record Attendance": ["Merchandise", "Keith Bird"], // Zettle
  "Keith Bird Print - Spirit of North Bank": ["Merchandise", "Keith Bird"], // Zettle
  "Keith Bird Print - Manchester": ["Merchandise", "Keith Bird"], // Zettle
  "Beautiful Grounds": ["Merchandise", "Books"],
  "Roots To The 92": ["Merchandise", "Books"],
  "Ohhh, What A Goal - A3": ["Merchandise"],
  "Drawstring Bag (new)": ["Merchandise"],
  "Pitch Invasion T-shirt": ["Merchandise"], // Zetttle
  "JPT Final - 2013": ["Merchandise"], // Zettle
  "LDV Vans Trophy - 2004": ["Merchandise"], // Zettle
  "LDV Vans Trophy - 2005": ["Merchandise"], // Zettle
  "League 1 Champions - 2005-06": ["Merchandise"], // Zettle
  "League 2 Play Off Winners - 2005": ["Merchandise"], // Zettle
  "League 2 Play Off Winners - 2015": ["Merchandise"], // Zettle
  "New Trust Badge": ["Merchandise"], // Zettle
  "The Blue Voice": ["Merchandise"], // Zettle
  "Year Badge": ["Merchandise"], // Zettle
  "Trust (SUSCT) Badge (shield)": ["Merchandise"], // Zettle

  "Christmas Draw 2024": ["Fundraising", "Christmas Draw"], // Zettle
  "Xmas Donation": ["Fundraising", "Christmas Draw"],
  "The Big Christmas Quiz - 2024": ["Fundraising", "Christmas Quiz"],
  "Shrimpers Trust Xmas Quiz Sponsorship": ["Fundraising", "Christmas Quiz"],
  "Christmas Quiz 2024": ["Fundraising", "Christmas Quiz"], // Zettle
  "Rebrand Badge": ["Merchandise"], // Zettle
  "Drawstring Rucksack (new)": ["Merchandise"], // Zettle
  "Trolley Keyring": ["Merchandise"], // Zettle
  "Programmes & Memorabillia": ["Merchandise"], // Zettle
  "Sammy Shrimp Badge (SUCF)": ["Merchandise"], // Zettle

  // Junior Blues merchandise
  "Junior Blues Scarf": ["Junior Blues", "Merchandise"],
  "Junior Blues Pop Socket": ["Junior Blues", "Merchandise"],
  "Junior Blues Pin Badge": ["Junior Blues", "Merchandise"],
  "Junior Blues Battle Cards": ["Junior Blues", "Merchandise"],
  "Junior Blues Cool / Lunch Bag": ["Junior Blues", "Merchandise"],
  "Junior Blues Money Box": ["Junior Blues", "Merchandise"],
  "Junior Blues Bam Bams": ["Junior Blues", "Merchandise"],
  "3 x Junior blues lunch pack": ["Junior Blues", "Merchandise"],

  "Battle Cards": ["Junior Blues", "Merchandise"], // Zettle
  "Autograph Book": ["Junior Blues", "Merchandise"], // Zettle
  "Junior Blues - Badge": ["Junior Blues", "Merchandise"], // Zettle
  "Car Sticker": ["Junior Blues", "Merchandise"], // Zettle
  "Lunch Box": ["Junior Blues", "Merchandise"], // Zettle
  Pen: ["Junior Blues", "Merchandise"], // Zettle
  "New Drawstring Bag": ["Junior Blues", "Merchandise"], // Zettle

  // Junior Blues events
  "Junior Blues Meet The Players Day - 2024": [
    "Junior Blues",
    "Meet the Players",
  ],
  "Junior Blues Christmas Party 2024": ["Junior Blues", "Xmas Party"],
  "Junior Blues Xmas Party": ["Junior Blues", "Xmas Party"],
  "Junior Blues Easter Fun": ["Junior Blues", "Easter Fun Day"],

  // Events
  "An Evening With 'Red Card' Roy McDonough": [
    "Events",
    "Red Card Roy McDonough",
  ],
  "This Is Your Life - Steve Tilson": ["Events", "Steve Tilson"],
  "Sponsored Walk Donation": ["Fundraising", "Sponsored Walk"],

  // Micky Steed
  "Micky Stead Donation": ["SUEPA", "Micky Steed"],
  "A Match For Micky": ["SUEPA", "Micky Steed"],
  "Online Donation for Micky Stead Benefit": ["SUEPA", "Micky Steed"],
  "Micky  Stead Goods": ["SUEPA", "Micky Steed"],
  "Micky Stead Goods": ["SUEPA", "Micky Steed"],
  "Micky Stead Match - Adult": ["SUEPA", "Micky Steed"],
  "Micky Stead Match - Concession": ["SUEPA", "Micky Steed"],
  "Micky Stead Match - Programme": ["SUEPA", "Micky Steed"],

  // Miscellaneous
  "POTY Auction": ["Miscellaneous", "POTY Auction"],
  "Online Ticket": ["Miscellaneous", "Online Tickets"],

  "Donate money to Little Heroes ASD": ["Donation", "Little Heroes ASD"],
  Donation: ["Donation", "General"],
  "James Walker Donation of £20": ["Donation", "James Walker"],
  "James Walker Donation of £10": ["Donation", "James Walker"],
  "James Walker Donation of £15": ["Donation", "James Walker"],
  "James Walker Donation of £30": ["Donation", "James Walker"],
  "James Walker Donation of £40": ["Donation", "James Walker"],
  "James Walker Donation of £50": ["Donation", "James Walker"],
  "James Walker Donation of £5": ["Donation", "James Walker"],

  // Purchases
  UKA39905577556: ["Away Travel", "Awards"],
  "Paypal Surcharge": ["Membership", "Expenses"],
  RoyalMailConsumerJourney: ["Membership", "Expenses"],
  "R-IA-SMYMCKO": ["Membership", "Expenses"],
};
