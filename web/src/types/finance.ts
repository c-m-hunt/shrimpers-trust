export type ReportBalances = {
  startBalance: number;
  endBalance: number;
};

export type ItemSummaryMap = {
  [key: string]: ItemSummary;
};
export type SummaryData = {
  dateRange: {
    start: Date;
    end: Date;
  };
  balance: ReportBalances;
  transTotal: number;
  feesTotal: number;
  chargebackTotal: number;
  refundsTotal: number;
  shippingTotal: number;
  withdrawalTotal: number;
  spendingTotal: number;
  cardTotal: number;
  transactionCount: number;
  itemsValue: number;
  pendingValue: number;
  itemTotals: ItemSummaryMap;
  refundItemTotals: ItemSummaryMap;
};

export type ItemSummary = {
  total: number;
  qty: number;
  category?: string;
};

export type CardSummary = {
  totalTransactions: number;
  totalAmount: number;
  totalFees: number;
  productTotals: { [key: string]: number };
  productCount: { [key: string]: number };
  productNames: { [key: string]: string };
  productCategories: { [key: string]: string };
  itemSummary: { [key: string]: ItemSummary };
};
