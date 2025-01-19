import { createClient, RedisClientType } from "redis";
import environment from "config/environment";
import logger from "utils/logger";

const redisClient: RedisClientType = createClient({
  url: `redis://${environment.redisHost}:${environment.redisPort}`,
  password: environment.redisPassword,
});

redisClient.on("error", (err: Error) => {
  console.error("Redis Client error:", err);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("Connected to Redis");
  } catch (error) {
    logger.error("Error connecting to Redis:", error);
  }
};

export default redisClient;
