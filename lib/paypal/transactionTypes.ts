type CurrencyAmount = {
  currencyCode: string;
  value: string;
};

type TransactionInfo = {
  paypalAccountId: string;
  transactionId: string;
  transactionEventCode: string;
  transactionInitiationDate: string;
  transactionUpdatedDate: string;
  transactionAmount: CurrencyAmount;
  shippingAmount: CurrencyAmount;
  feeAmount: CurrencyAmount;
  transactionStatus: string;
  endingBalance: CurrencyAmount;
  availableBalance: CurrencyAmount;
  invoiceId: string;
  customField: string;
  protectionEligibility: string;
  instrumentType: string;
  instrumentSubType: string;
};

type PayerName = {
  givenName: string;
  surname: string;
  alternateFullName: string;
};

type PayerInfo = {
  accountId: string;
  addressStatus: string;
  payerStatus: string;
  payerName: PayerName;
  countryCode: string;
};

type ShippingInfo = {
  name: string;
};

type ItemDetails = {
  itemName: string;
  itemDescription: string;
  itemQuantity: string;
  itemUnitPrice: CurrencyAmount;
  itemAmount: CurrencyAmount;
  totalItemAmount: CurrencyAmount;
  invoiceNumber: string;
};

type CartInfo = {
  itemDetails: ItemDetails[];
};

export type Transaction = {
  transactionInfo: TransactionInfo;
  payerInfo: PayerInfo;
  shippingInfo: ShippingInfo;
  cartInfo: CartInfo;
  storeInfo: Record<string, unknown>;
  auctionInfo: Record<string, unknown>;
  incentiveInfo: Record<string, unknown>;
};
