import express, { Request, Response } from "express";
import accountRouter from "./route/account.router";
import { connectRedis } from "config/redis.config";
import errorMiddleware from "middleware/error-middleware";
import helmet from "helmet";
import logger from "utils/logger";
import logMiddleware from "middleware/log-middleware";

const app = express();

// Подключение к Redis
connectRedis();

app.use(helmet());
app.use(express.json());
app.use(logMiddleware);
app.use("/", accountRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, it is kelk-auth service with deploy!");
});

app.use(errorMiddleware);

// Функция для записи лога при завершении работы
const shutdown = () => {
  logger.info("Server is shutting down");
  process.exit(0); // Завершаем процесс с кодом 0
};

// Обрабатываем сигнал SIGTERM (обычно приходит при остановке контейнера)
process.on("SIGTERM", shutdown);

// Обрабатываем сигнал SIGINT (обычно приходит при прерывании работы)
process.on("SIGINT", shutdown);
export default app;
