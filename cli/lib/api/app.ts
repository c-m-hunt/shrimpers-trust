import express, { NextFunction, Request, Response } from "npm:express";
import { sendPasswordResetEmail } from "../utils/email.ts";
import cors from "npm:cors";
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
      const resp = await sendPasswordResetEmail(email, name, username, password);
      res.send(resp);
    } catch (e) {
      res.status(500).send({"error": e});
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};
