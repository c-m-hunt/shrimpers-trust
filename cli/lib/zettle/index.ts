import fetch from "node-fetch";
import { Buffer } from "node:buffer";
import { logger } from "../utils/index.ts";
import { getCache, setCache } from "../cache/index.ts";

export const base64Encode = (data: string): string => {
  const buf = Buffer.from(data);
  return buf.toString("base64");
};

type RequestMethod = "GET" | "POST" | "DELETE";
interface RequestOptions {
  method: RequestMethod;
  // deno-lint-ignore no-explicit-any
  headers: any;
  body?: string;
}

export class Zettle {
  accessToken: string | null = null;
  clientID: string;
  secret: string;
  constructor(
    clientId: string,
    secret: string,
  ) {
    this.clientID = clientId;
    this.secret = secret;
  }

  authenticate = async () => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const options: RequestOptions = {
      method: "POST",
      headers,
      body:
        `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&client_id=${this.clientID}&assertion=${this.secret}`,
    };

    const response = await fetch(
      `https://oauth.zettle.com/token`,
      options,
    );
    if (response.status === 200) {
      // deno-lint-ignore no-explicit-any
      const responseObject: any = await response.json();
      this.accessToken = responseObject["access_token"];
      logger.info(`Authenticated with Zettle.`);
    } else {
      logger.error(
        `Failed to authenticate with Zettle. Response: ${response.status}`,
      );
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

    if (!this.accessToken) {
      await this.authenticate();
    }

    headers = headers || {
      "Authorization": `Bearer ${this.accessToken}`,
    };

    const options: RequestOptions = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    logger.info(`Getting data from ${url}`);

    const response = await fetch(
      url,
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
