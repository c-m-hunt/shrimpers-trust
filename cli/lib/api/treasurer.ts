import express from "npm:express";
import { reconcilePaypalTransactionsForMonth } from "../treasurer/reconciliation.ts";
import { reconcileZettlePurchases } from "../treasurer/reconcileCardPurchases.ts";

const treasurerRouter = express.Router();

treasurerRouter.get("/paypal/:month/:year", async (req, res) => {
  const { month, year } = req.params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  try {
    const data = await reconcilePaypalTransactionsForMonth(startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

treasurerRouter.get("/zettle/:month/:year", async (req, res) => {
  const { month, year } = req.params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  try {
    const data = await reconcileZettlePurchases(startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { treasurerRouter };
