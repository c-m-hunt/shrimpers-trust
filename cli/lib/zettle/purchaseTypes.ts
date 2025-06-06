export type Purchase = {
  source: string;
  purchaseUUID: string;
  amount: number;
  vatAmount: number;
  taxAmount: number;
  country: string;
  currency: string;
  timestamp: string;
  purchaseNumber: number;
  globalPurchaseNumber: number;
  userDisplayName: string;
  userId: number;
  organizationId: number;
  products: Product[];
  discounts: unknown[]; // Adjust the type if the structure of discounts is known
  payments: Payment[];
  receiptCopyAllowed: boolean;
  references: {
    shoppingCartUuid: string;
    checkoutUUID: string;
  };
  taxationMode: string;
  taxationType: string;
  taxValues: TaxValue[];
  customAmountSale: boolean;
  created: string;
  purchaseUUID1: string;
  groupedVatAmounts: Record<string, number>;
  refunded: boolean;
  refund: boolean;
  gpsCoordinates?: GPSCoordinates; // Optional since it's missing in some purchases
};

type Product = {
  quantity: string;
  productUuid: string;
  variantUuid: string;
  vatPercentage: number;
  taxRates: { percentage: number }[];
  taxExempt: boolean;
  unitPrice: number;
  costPrice: number;
  rowTaxableAmount: number;
  name: string;
  variantName: string;
  category: {
    uuid: string;
    name: string;
  };
  fromLocationUuid: string;
  toLocationUuid: string;
  autoGenerated: boolean;
  id: string;
  type: string;
  grossValue: number;
  grossTax: number;
  details: Record<string, unknown>; // Adjust the type if details structure is known
  libraryProduct: boolean;
};

type Payment = {
  uuid: string;
  amount: number;
  type: string;
  createdAt: string;
  attributes: PaymentAttributes;
};

type PaymentAttributes = {
  cardHolderVerificationMethod: string;
  maskedPan: string;
  acquirerMID: string;
  cardPaymentEntryMode: string;
  referenceNumber: string;
  authorizationCode: string;
  cardType: string;
  terminalVerificationResults: string;
  applicationIdentifier: string;
  applicationName: string;
  mxPaymentMethodCode: number;
  acqSystemTraceAuditNr?: number; // Optional since it's not in all cases
};

type TaxValue = {
  label: string | null;
  taxValue: number;
  taxAmount: number;
  totalAmount: number;
  taxableAmount: number;
};

type GPSCoordinates = {
  longitude: number;
  latitude: number;
  accuracyMeters: number;
};
