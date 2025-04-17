import { Redis } from "@upstash/redis";
import { Logger } from "./winston.js";
import constants from "../config/constants.js";

const logger = new Logger("redis.js");

//using redis upstash
export class Cache {
    static instance = null;

    constructor() {
        if (Cache.instance) {
            return Cache.instance;
        }

        if (process.env.REDIS_ENABLE != constants.boolean.true) {
            logger.info("Redis connection is disabled.");
            return;
        }
        
        this.redis = new Redis({
            url: process.env.REDIS_URL,
            token: process.env.REDIS_TOKEN,
        });

        Cache.instance = this;
    }

    async testConnection() {
        try {
            await this.redis.ping();
            logger.info("Redis connection established successfully.");
            return true;
        } catch (err) {
            logger.error(`Redis connection error: ${err}`);
            return false;
        }
    }
    async set(key, value, ttlInSeconds = 300) {
        try {
            return await this.redis.set(key, value, { ex: ttlInSeconds });
        } catch (err) {
            logger.error(`Cache Set Error: ${err}`);
            return null;
        }
    }


    async get(key) {
        try {
            return await this.redis.get(key);
        } catch (err) {
            logger.error(`Cache Get Error: ${err}`);
            return null;
        }
    }

    async del(key) {
        try {
            return await this.redis.del(key);
        } catch (err) {
            logger.error(`Cache Delete Error: ${err}`);
            return null;
        }
    }
}
