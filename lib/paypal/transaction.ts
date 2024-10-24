import { PayPal } from "./index.ts";
import logger from "../../utils/index.ts";
import { Transaction as TransactionType } from "./transactionTypes.ts";

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

export class Transaction extends PayPal {
  search = async (searchCritera: TransactionSearchCriteria) => {
    const pageSize = 20;
    let page = 1;
    let transactions: TransactionType[] = [];

    while (true) {
      const queryString = new URLSearchParams({
        ...searchCritera,
        page: page.toString(),
        page_size: pageSize.toString(),
      }).toString();
      const resp: any = await this.request(
        "/reporting/transactions?" + queryString,
        "GET",
      );
      transactions = transactions.concat(resp.transaction_details);
      if (resp.total_pages === page) {
        break;
      }
      page++;
    }
    return transactions;
  };
}

const transactions: { [key: string]: Transaction } = {};

export const getTransactionSingleton = async (
  clientId: string,
  secret: string,
  sandbox: boolean = false,
  version: string = "v2",
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


