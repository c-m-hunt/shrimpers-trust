import fetch from "node-fetch";
import { Buffer } from "node:buffer";
import { logger } from "../utils/index.ts";
import { getCache, setCache } from "./cache.ts";

export const base64Encode = (data: string): string => {
  const buf = Buffer.from(data);
  return buf.toString("base64");
};

const BASE_URL = "https://api-m.paypal.com";
const SANDBOX_BASE_URL = "https://api.sandbox.paypal.com";

type RequestMethod = "GET" | "POST" | "DELETE";
interface RequestOptions {
  method: RequestMethod;
  headers: any;
  body?: string;
}

export class PayPal {
  baseUrl: string;
  accessToken: string | null = null;
  clientID: string;
  secret: string;
  version: string;
  constructor(
    clientId: string,
    secret: string,
    sandbox: boolean = false,
    version: string = "v2",
  ) {
    this.clientID = clientId;
    this.secret = secret;
    this.baseUrl = sandbox ? SANDBOX_BASE_URL : BASE_URL;
    this.version = version;
  }

  authenticate = async () => {
    const headers = {
      "Accept": "application/json",
      "Accept-Language": "en_GB",
      Authorization: `Basic ${base64Encode(`${this.clientID}:${this.secret}`)}`,
    };

    const options: RequestOptions = {
      method: "POST",
      headers,
      body: "grant_type=client_credentials",
    };

    const response = await fetch(
      `${this.baseUrl}/v1/oauth2/token`,
      options,
    );
    if (response.status === 200) {
      const responseObject: any = await response.json();
      this.accessToken = responseObject["access_token"];
    }
  };

  request = async (
    url: string,
    method: RequestMethod = "GET",
    data: object | null = null,
    headers: object | null = null,
    _body: object | string | null = null,
    expectJson = true,
  ) => {
    // Cache key is MD5 hash of the URL
    const cacheKey = new TextEncoder().encode(url);
    const hash = await crypto.subtle.digest("SHA-256", cacheKey);
    const cachedData = getCache(Buffer.from(hash).toString("hex"));
    if (cachedData) {
      return cachedData;
    }

    headers = headers || {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.accessToken}`,
    };

    const options: RequestOptions = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    logger.info(`Getting data from s${this.baseUrl}/${this.version}${url}`);

    const response = await fetch(
      `${this.baseUrl}/${this.version}${url}`,
      options,
    );

    logger.debug(`Status code ${response.status}`);

    if (expectJson) {
      const returnData: object = (await response.json()) as object;
      setCache(Buffer.from(hash).toString("hex"), returnData);
      return returnData;
    } else {
      return await response.text();
    }
  };
}
