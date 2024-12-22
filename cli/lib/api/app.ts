import express from "npm:express";
import cors from "npm:cors";
import toolsRouter from "./tools.ts";
import { treasurerRouter } from "./treasurer.ts";

const apiPort = Deno.env.get("API_PORT") || "3000";

export const setupApi = () => {
  const app = express();

  const port = apiPort;

  app.use(cors());
  app.use(express.json());
  app.use("/tools", toolsRouter);
  app.use("/treasurer", treasurerRouter);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};
