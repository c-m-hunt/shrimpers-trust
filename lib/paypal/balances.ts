import { PayPal } from "./index.ts";
import logger from "../../utils/index.ts";

export class Balances extends PayPal {
  get = async () => {
    return await this.request(
      "/reporting/balances",
      "GET",
      null,
      null,
      null,
      false,
    );
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
