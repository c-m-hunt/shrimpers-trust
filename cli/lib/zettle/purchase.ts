import { Zettle } from "./index.ts";

import { DEFAULT_PAGE_SIZE } from "./consts.ts";
import { Purchase as PurchaseType } from "./purchaseTypes.ts";

export type ProductFilter = {
  startDate: string;
  endDate: string;
};

type PurchasesResponse = {
  purchases: PurchaseType[];
  firstPurchaseHash?: string;
  lastPurchaseHash?: string;
  linkUrls?: string[];
};

// https://developer.zettle.com/docs/api/purchase/user-guides/fetch-purchases/fetch-a-list-of-purchases
export class Purchase extends Zettle {
  getPurchases = async (
    filter: ProductFilter,
  ): Promise<PurchaseType[]> => {
    const pageSize = DEFAULT_PAGE_SIZE;
    let purchases: PurchaseType[] = [];
    let lastPurchaseHash = "";

    while (true) {
      const queryString = new URLSearchParams({
        ...filter,
        limit: pageSize.toString(),
        lastPurchaseHash,
      }).toString();
      const resp: PurchasesResponse = await this.request(
        "https://purchase.izettle.com/purchases/v2?" + queryString,
        "GET",
      ) as PurchasesResponse;

      purchases = purchases.concat(resp.purchases);
      if (!resp.lastPurchaseHash) {
        break;
      }
      lastPurchaseHash = resp.lastPurchaseHash;
    }
    return purchases;
  };
}
