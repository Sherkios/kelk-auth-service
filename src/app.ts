import express from "express";
import accountRouter from "./route/account.router";
import { connectRedis } from "config/redis.config";
import errorMiddleware from "middleware/error-middleware";

const app = express();

// Подключение к Redis
connectRedis();

app.use(express.json());
app.use("/", accountRouter);

app.use(errorMiddleware);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, TypeScript with Хахахах!");
// });
export default app;
