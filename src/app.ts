import pool from "db/db";
import express, { Request, Response } from "express";

const PORT = process.env.AUTH_PORT || 5000;

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Хахахах!");
});

const start = () => {
  try {
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

start();

pool;
