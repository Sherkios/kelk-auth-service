import { Pool } from "pg";

import environment from "config/environment";

const pool = new Pool({
  user: environment.dbUser,
  password: environment.dbPassword,
  host: environment.dbHost,
  port: environment.dbPort,
  database: environment.dbName,
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
