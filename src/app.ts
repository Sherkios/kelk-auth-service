import express from "express";
import accountRouter from "./route/account.router";

const app = express();

app.use(express.json());
app.use("/", accountRouter);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, TypeScript with Хахахах!");
// });
export default app;
