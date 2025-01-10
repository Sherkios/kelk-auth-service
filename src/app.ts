import express from "express";
import accountRouter from "./route/account.router";
import { connectRedis } from "config/redis.config";

const app = express();

// Подключение к Redis
connectRedis();

app.use(express.json());
app.use("/", accountRouter);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, TypeScript with Хахахах!");
// });
export default app;
