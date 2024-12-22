import express, { Request, Response } from "npm:express";
import { reconcileZettlePurchases } from "../../treasurer/reconcileCardPurchases.ts";
import { reconcilePaypalTransactionsForMonth } from "../../treasurer/reconciliation.ts";
import { getStartAndEndDates } from "../utils/index.ts";

const treasurerRouter = express.Router();

treasurerRouter.get(
  "/paypal/:month/:year",
  async (req: Request, res: Response) => {
    const { month, year } = req.params;
    const { startDate, endDate } = getStartAndEndDates(month, year);
    try {
      const data = await reconcilePaypalTransactionsForMonth(
        startDate,
        endDate,
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
);

treasurerRouter.get(
  "/zettle/:month/:year",
  async (req: Request, res: Response) => {
    const { month, year } = req.params;
    const { startDate, endDate } = getStartAndEndDates(month, year);
    try {
      const data = await reconcileZettlePurchases(startDate, endDate);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
);

export { treasurerRouter };
