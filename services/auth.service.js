import bcrypt from "bcrypt";
import { Logger } from "../integrations/winston.js";
import { nodeCache } from '../integrations/nodeCache.js';
import { Codes } from "../config/codes.js";
import User from "../models/user.model.js";
import { Cache } from "../integrations/redis.js";
import constants from "../config/constants.js";
import { Twil } from "../integrations/sms.js";
import { generateToken } from "../middlewares/auth.js";

const logger = new Logger();
const redisCache = new Cache();

class AuthService {
  constructor() {
    this.user = User;
    this.bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    this.twil = new Twil();
  }

  async register(username, email, password, phone, role, active) {
    try {
      const existingUser = await this.user.findOne({ where: { email } });
      if (existingUser) {
        logger.error(`AuthService.register: existing user with same email ${email}`);
        throw new Error(Codes.STX0002);
      }

      const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);
      const newUser = await this.user.create({ username, email, password: hashedPassword, phone, role, active });

      logger.info(`AuthService.register: user registered successfully with email ${email}`);
      if (!this.twil.enabled) logger.info(`Sms provider disabled`)

      if (this.twil.enabled && newUser.phone) {
        const message = `Welcome ${newUser.username}! Email: ${newUser.email}, Password: ${password}.`;
        this.twil.sendSMS(`+91${newUser.phone}`, message);
      }

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
        throw new Error(Codes.STX0011);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.error(`AuthService.login: incorrect password for email ${email}`);
        throw new Error(Codes.STX0005);
      }

      const accessToken = await generateToken(
        { userId: user.id, username: user.username, role: user.role },
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

  async changePassword(username, oldPassword, newPassword) {
    try {
      const user = await this.user.findOne({ where: { username } });
      if (!user) throw new Error(Codes.STX0011);

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error(Codes.STX0015);

      const hashedPassword = await bcrypt.hash(newPassword, this.bcryptSaltRounds);
      await this.user.update({ password: hashedPassword }, { where: { username: username } });

      logger.info(`AuthService.changePassword: password changed successfully for user ${username}`);
      return { username: username };
    } catch (error) {
      logger.error(`AuthService.changePassword: ${error.message}`);
      throw error;
    }
  }

  async resetPassword(username) {
    try {
      const user = await this.user.findOne({ where: { username } });
      if (!user) throw new Error(Codes.STX0011);
      const hashPassword = await bcrypt.hash(process.env.RESETTED_PASSWORD, this.bcryptSaltRounds);
      await this.user.update({ password: hashPassword }, { where: { username: username } });
      logger.info(`AuthService.resetPassword: password reset successfully for user ${username}`);
      return { username: username };
    } catch (error) {
      logger.error(`AuthService.resetPassword: ${error.message}`);
      throw error;
    }
  }


  async logout(accessToken, tokenData) {
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl = Math.max(tokenData.exp - currentTime, 1);

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

}

export default AuthService;
