import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: Number(process.env.AUTH_FORWARD_PORT) || 5000,
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  dbUser: process.env.DB_USER,
};

export default environment;
