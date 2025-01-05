import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config();

const PORT: number = Number(process.env.DB_PORT) || 5432;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: PORT,
  database: process.env.DB_NAME,
});

const connect = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL");
    client.release(); // Освободить подключение обратно в пул
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};

connect();

export default pool;
