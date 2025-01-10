import { createClient, RedisClientType } from "redis";
import environment from "config/environment";

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
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

export default redisClient;
