import { PayPal } from "./index.ts";
import logger from "../utils/logger.ts";
import { CURRENCY } from "./consts.ts";
import { transformKeysToCamelCase } from "../utils/index.ts";

type AccountBalance = {
  currency: string;
  primary: boolean;
  totalBalance: {
    currencyCode: string;
    value: string;
  };
  availableBalance: {
    currencyCode: string;
    value: string;
  };
  withheldBalance: {
    currencyCode: string;
    value: string;
  };
};

type AccountInfo = {
  balances: AccountBalance[];
  accountId: string;
  asOfTime: string;
  lastRefreshTime: string;
};

export class Balances extends PayPal {
  get = async (date?: Date): Promise<AccountInfo> => {
    let url = "/reporting/balances";
    if (date) {
      const query = new URLSearchParams({
        as_of_time: date.toISOString(),
        currency_code: CURRENCY,
      }).toString();
      url = `${url}?${query}`;
    }
    const resp = await this.request(
      url,
      "GET",
      null,
      null,
      null,
      true,
    );
    return transformKeysToCamelCase(resp) as AccountInfo;
  };
}

const balances: { [key: string]: Balances } = {};

export const getBalancesSingleton = async (
  clientId: string,
  secret: string,
  sandbox: boolean = false,
  version: string = "v1",
): Promise<Balances> => {
  const key = `${clientId}${secret}${sandbox}${version}`;
  if (Object.keys(balances).includes(key)) {
    logger.debug("Using existing class");
    return balances[key];
  }
  const bal = new Balances(clientId, secret, sandbox, version);
  await bal.authenticate();
  balances[key] = bal;
  return bal;
};
