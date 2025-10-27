import { PayPal } from "./index.ts";

import { Transaction as TransactionType } from "./transactionTypes.ts";
import { logger, transformKeysToCamelCase } from "../utils/index.ts";
import { DEFAULT_PAGE_SIZE } from "./consts.ts";

export type TransactionSearchCriteria = {
  start_date: string;
  end_date: string;
  transaction_id?: string;
  invoice_id?: string;
  transaction_status?: string;
  fields?: string;
  currency_code?: string;
  page?: string;
};

type TransactionSearchResponse = {
  transaction_details: TransactionType[];
  total_pages: number;
};

// https://developer.paypal.com/docs/api/transaction-search/v1/
export class Transaction extends PayPal {
  search = async (
    searchCritera: TransactionSearchCriteria,
  ): Promise<TransactionType[]> => {
    const pageSize = DEFAULT_PAGE_SIZE;
    let page = 1;
    let transactions: TransactionType[] = [];

    while (true) {
      const queryString = new URLSearchParams({
        ...searchCritera,
        page: page.toString(),
        page_size: pageSize.toString(),
      }).toString();
      const resp: TransactionSearchResponse = (await this.request(
        "/reporting/transactions?" + queryString,
        "GET",
      )) as TransactionSearchResponse;
      transactions = transactions.concat(resp.transaction_details);
      if (resp.total_pages === undefined || resp.total_pages === 0) {
        throw Error("Total pages not found in response");
      }
      if (resp.total_pages === page) {
        break;
      }
      page++;
    }
    return transformKeysToCamelCase(transactions);
  };
}

const transactions: { [key: string]: Transaction } = {};
const orders: { [key: string]: Orders } = {};

export const getTransactionSingleton = async (
  clientId: string,
  secret: string,
  sandbox: boolean = false,
  version: string = "v1",
): Promise<Transaction> => {
  const key = `${clientId}${secret}${sandbox}${version}`;
  if (Object.keys(transactions).includes(key)) {
    logger.debug("Using existing class");
    return transactions[key];
  }
  const trans = new Transaction(clientId, secret, sandbox, version);
  await trans.authenticate();
  transactions[key] = trans;
  return trans;
};

export class Orders extends PayPal {
  getPaymentDetails = async (transactionId: string): Promise<any> => {
    const resp = await this.request(
      `/payments/captures/${transactionId}`,
      "GET",
    );
    if (resp === undefined) {
      throw Error("Payment details not found in response");
    }
    return transformKeysToCamelCase(resp);
  };

  getOrderDetails = async (orderId: string): Promise<any> => {
    const resp = await this.request(`/checkout/orders/${orderId}`, "GET");
    if (resp === undefined) {
      throw Error("Order details not found in response");
    }
    return transformKeysToCamelCase(resp);
  };
}

export const getOrderSingleton = async (
  clientId: string,
  secret: string,
  sandbox: boolean = false,
  version: string = "v2",
): Promise<Orders> => {
  const key = `${clientId}${secret}${sandbox}${version}`;
  if (Object.keys(orders).includes(key)) {
    logger.debug("Using existing class");
    return orders[key];
  }
  const order = new Orders(clientId, secret, sandbox, version);
  await order.authenticate();
  orders[key] = order;
  return order;
};
