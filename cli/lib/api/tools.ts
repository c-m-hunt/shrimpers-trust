import express, { Request, Response } from "npm:express";
import { clearCache } from "../cache/index.ts";
import { sendPasswordResetEmail } from "../utils/email.ts";

const toolsRouter = express.Router();

toolsRouter.post("/passwordreset", async (req: Request, res: Response) => {
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

toolsRouter.post("/clearcache", async (_req: Request, res: Response) => {
  try {
    await clearCache();
    res.send({ message: "Cache cleared successfully" });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

export default toolsRouter;
