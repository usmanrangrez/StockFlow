import bcrypt from "bcrypt";
import { Logger } from "../integrations/winston.js";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import { Codes } from "../config/codes.js";
import User from "../models/user.model.js";
import { Cache } from "../integrations/redis.js";
import constants from "../config/constants.js";

const logger = new Logger();
const nodeCache = new NodeCache();
const redisCache = new Cache();

class AuthService {
  constructor() {
    this.user = User;
    this.bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
  }

  async register(username, email, password, role, active) {
    try {
      const existingUser = await this.user.findOne({ where: { email } });
      if (existingUser) {
        logger.error(`AuthService.register: existing user with same email ${email}`);
        throw new Error(Codes.STX0002);
      }

      const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);
      const newUser = await this.user.create({ username, email, password: hashedPassword, role, active });

      logger.info(`AuthService.register: user registered successfully with email ${email}`);

      const userWithoutPassword = newUser.toJSON();
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      logger.error(`AuthService.register: ${error.message}`);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.user.findOne({ where: { email } });
      if (!user) {
        logger.error(`AuthService.login: user not found with email ${email}`);
        throw new Error(Codes.STX0008);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.error(`AuthService.login: incorrect password for email ${email}`);
        throw new Error(Codes.STX0005);
      }

      const accessToken = this.generateToken(
        { userId: user.username, role: user.role },
        process.env.ACCESS_TOKEN_KEY,
        parseInt(process.env.ACCESS_TOKEN_EXPIRY)
      );

      logger.info(`AuthService.login: user logged in successfully with email ${email}`);
      return { username: user.username, accessToken };
    } catch (error) {
      logger.error(`AuthService.login: ${error.message}`);
      throw error;
    }
  }

  async logout(accessToken) {
    if (!accessToken) {
      logger.error(`AuthService.logout: access token is missing`);
      throw new Error(Codes.STX0006);
    }

    try {
      const tokenData = await this.verifyToken(accessToken, process.env.ACCESS_TOKEN_KEY);
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl = Math.max(tokenData.exp - currentTime, 1);

      // Blacklist token based on cache availability
      if (process.env.REDIS_CONNECTION == constants.boolean.true) {
        logger.info("AuthService.logout: using Redis for token blacklisting");
        await redisCache.set(accessToken, true, ttl);
      } else {
        logger.info("AuthService.logout: using NodeCache for token blacklisting");
        nodeCache.set(accessToken, true, ttl);
      }

      logger.info(`AuthService.logout: Token blacklisted for ${ttl}s`);
      return tokenData;
    } catch (error) {
      logger.error(`AuthService.logout: ${error.message}`);
      throw error;
    }
  }

  async isTokenBlacklisted(token) {
    if (process.env.REDIS_CONNECTION === "true" || process.env.REDIS_CONNECTION === true) {
      const value = await redisCache.get(token);
      return Boolean(value);
    } else {
      return nodeCache.has(token);
    }
  }

  async verifyToken(token, secret) {
    try {
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        logger.warn("Token is blacklisted");
        throw new Error("Token is blacklisted");
      }

      return jwt.verify(token, secret);
    } catch (error) {
      logger.error(`AuthService.verifyToken: ${error.message}`);
      throw error;
    }
  }

  generateToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }
}

export default AuthService;
