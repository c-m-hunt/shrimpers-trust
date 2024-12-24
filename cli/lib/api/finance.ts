import express, { Request, Response } from "npm:express";
import { reconcileZettlePurchases } from "../../treasurer/reconcileCardPurchases.ts";
import { reconcilePaypalTransactionsForMonth } from "../../treasurer/reconciliation.ts";
import { getStartAndEndDates } from "../utils/index.ts";

const financeRouter = express.Router();

financeRouter.get(
  "/paypal/:month/:year",
  async (req: Request, res: Response) => {
    const { month, year } = req.params;
    const { startDate, endDate } = getStartAndEndDates(
      parseInt(month),
      parseInt(year),
    );
    console.log(startDate, endDate);
    try {
      const data = await reconcilePaypalTransactionsForMonth(
        startDate,
        endDate,
      );
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  },
);

financeRouter.get(
  "/zettle/:month/:year",
  async (req: Request, res: Response) => {
    const { month, year } = req.params;
    const { startDate, endDate } = getStartAndEndDates(
      parseInt(month),
      parseInt(year),
    );
    try {
      const data = await reconcileZettlePurchases(startDate, endDate);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
);

export { financeRouter };
