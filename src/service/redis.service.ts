import redisClient from "config/redis.config";

export default class RedisService {
  public static async set(key: string, value: string, expiration?: number): Promise<void> {
    await redisClient.set(key, value);

    if (expiration) {
      await redisClient.expire(key, expiration);
    }
  }

  public static async get(key: string): Promise<string | null> {
    const result = await redisClient.get(key);

    return result;
  }

  public static async delete(key: string | string[]): Promise<void> {
    await redisClient.del(key);
  }

  public static async hSet(
    key: string,
    field: string,
    value: string,
    expiration?: number,
  ): Promise<void> {
    await redisClient.hSet(key, field, value);

    if (expiration) {
      await redisClient.hExpire(key, field, expiration);
    }
  }

  public static async hGet(key: string, field: string): Promise<string | undefined> {
    return await redisClient.hGet(key, field);
  }
}
