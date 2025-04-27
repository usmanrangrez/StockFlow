import { Logger } from "../integrations/winston.js";
import { Codes } from "../config/codes.js";
import constants from "../config/constants.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { Twil } from "../integrations/sms.js";

const logger = new Logger();
class UserService {
  constructor() {
    this.user = User;
    this.bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    this.twil = new Twil();
  }

  async register(username, email, password, phone, role, active) {
    try {
      const existingUser = await this.user.findOne({ where: { email } });
      if (existingUser) {
        logger.error(`UserService.register: existing user with same email ${email}`);
        throw new Error(Codes.STX0002);
      }

      const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);
      const newUser = await this.user.create({
        username,
        email,
        password: hashedPassword,
        phone,
        role,
        active,
      });

      logger.info(`UserService.register: user registered successfully with email ${email}`);
      if (!this.twil.enabled) logger.info(`Sms provider disabled`);

      if (this.twil.enabled && newUser.phone) {
        const message = `Welcome ${newUser.username}! Email: ${newUser.email}, Password: ${password}.`;
        this.twil.sendSMS(`+91${newUser.phone}`, message);
      }

      const userWithoutPassword = newUser.toJSON();
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      logger.error(`UserService.register: ${error}`);
      throw error;
    }
  }

  async getDetails(username) {
    try {
      const userExists = await this.user.findOne({
        where: { username },
        raw: true,
      });
      if (!userExists) throw new Error(Codes.STX0011);
      delete userExists.password;
      return userExists;
    } catch (error) {
      logger.error(`UserService.getDetails: ${error}`);
      throw error;
    }
  }

  async editUser(username, data) {
    try {
      const userExists = await this.user.findOne({
        where: { username },
        raw: true,
      });
      if (!userExists) throw new Error(Codes.STX0011);
      await this.user.update(data, { where: { username } });
      const updatedUser = await this.user.findOne({
        where: { username },
        raw: true,
      });
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      logger.error(`UserService.editUser: ${error}`);
      throw error;
    }
  }
  async deleteUser(username) {
    try {
      const userExists = await this.user.findOne({
        where: { username },
        raw: true,
      });
      if (!userExists) throw new Error(Codes.STX0011);
      const admins = await this.user.findAll({
        where: { role: constants.db.roles.admin },
        raw: true,
      });
      if (admins.length === 1 && admins[0].username === username)
        throw new Error(Codes.STX0026);
      const deletedUser = await this.user.destroy({ where: { username } });
      return deletedUser;
    } catch (error) {
      logger.error(`UserService.deleteUser: ${error}`);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.user.findAndCountAll({ raw: true });
      if (users.count === 0 || !users.rows.length) throw new Error(Codes.STX0020);
      return users;
    } catch (error) {
      logger.error(`UserService.getAllUsers: ${error}`);
      throw error;
    }
  }
}

export default UserService;
