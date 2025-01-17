import express, { Request, Response } from "express";
import accountRouter from "./route/account.router";
import { connectRedis } from "config/redis.config";
import errorMiddleware from "middleware/error-middleware";
import helmet from "helmet";

const app = express();

// Подключение к Redis
connectRedis();

app.use(helmet());
app.use(express.json());
app.use("/", accountRouter);

app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, it is kelk-auth service!");
});
export default app;
