import express, { Request, Response } from "npm:express";
import { sendPasswordResetEmail } from "../utils/email.ts";
import cors from "npm:cors";
import { clearCache } from "../cache/index.ts"; // Pa796
const apiPort = Deno.env.get("API_PORT") || "3000";

export const setupApi = () => {
  const app = express();

  const port = apiPort;

  app.use(cors());
  app.use(express.json());

  app.post("/tools/passwordreset", async (req: Request, res: Response) => {
    const { email, name, username, password } = req.body;
    console.log(`Sending password reset email to ${email}`);
    try {
      const resp = await sendPasswordResetEmail(
        email,
        name,
        username,
        password,
      );
      res.send(resp);
    } catch (e) {
      res.status(500).send({ "error": e });
    }
  });

  app.post("/tools/clearcache", async (_req: Request, res: Response) => { // P43c9
    try {
      await clearCache(); // P43c9
      res.send({ message: "Cache cleared successfully" }); // P43c9
    } catch (e) {
      res.status(500).send({ error: e.message }); // P43c9
    }
  }); // P43c9

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};
