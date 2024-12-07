import express, { Request, Response, NextFunction } from "npm:express";
import { sendPasswordResetEmail } from "../utils/email.ts";


export const setupApi = () => {
    const app = express();

    const port = 3000;
    
    app.use(express.json());
    
    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, World!');
    });
    

    app.post('/passwordreset', async (req: Request, res: Response) => {
      const { email, name, username, password } = req.body;
      console.log(`Sending password reset email to ${email}`);
      await sendPasswordResetEmail(email, name, username, password);
      res.send('Password reset email sent');
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
}
