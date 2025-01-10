import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: Number(process.env.AUTH_FORWARD_PORT) || 5000,

  dbPort: Number(process.env.DB_FORWARD_PORT) || 5432,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  dbUser: process.env.DB_USER,

  jwtAccessToken: process.env.JWT_ACCESS_SECRET,
  jwtRefreshToken: process.env.JWT_REFRESH_SECRET,

  redisPort: Number(process.env.REDIS_FORWARD_PORT) || 6379,
  redisPassword: process.env.REDIS_PASSWORD,
  redisHost: process.env.REDIST_HOST,
};

export default environment;
