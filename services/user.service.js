import { Logger } from "../integrations/winston.js";
import { Codes } from "../config/codes.js";
import User from "../models/user.model.js";
import { raw } from "express";
import constants from "../config/constants.js";

const logger = new Logger();

class UserService {
    constructor() {
        this.user = User;
    }

    async getDetails(username) {
        try {
            const userExists = await this.user.findOne({ where: { username }, raw: true });
            if (!userExists) throw new Error(Codes.STX0011);
            delete userExists.password;
            return userExists;
        } catch (error) {
            logger.error(`AuthService.getDetails: ${error.message}`);
            throw error;
        }
    }

    async editUser(username, data) {
        try {
            const userExists = await this.user.findOne({ where: { username }, raw: true });
            if (!userExists) throw new Error(Codes.STX0011);
            await this.user.update(data, { where: { username } });
            const updatedUser = await this.user.findOne({ where: { username }, raw: true });
            delete updatedUser.password;
            return updatedUser;
        } catch (error) {
            logger.error(`AuthService.editUser: ${error.message}`);
            throw error;
        }
    }
    async deleteUser(username) {
        try {
            const userExists = await this.user.findOne({ where: { username }, raw: true });
            if (!userExists) throw new Error(Codes.STX0011);
            const admins = await this.user.findAll({ where: { role: constants.db.roles.admin }, raw: true });
            if (admins.length === 1 && admins[0].username === username) throw new Error(Codes.STX0026);
            const deletedUser = await this.user.destroy({ where: { username } });
            return deletedUser;
        } catch (error) {
            logger.error(`AuthService.deleteUser: ${error.message}`);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await this.user.findAndCountAll({ raw: true });
            if (users.count === 0 || !users.rows.length) throw new Error(Codes.STX0020);
            return users;
        } catch (error) {
            logger.error(`AuthService.getAllUsers: ${error.message}`);
            throw error;
        }
    }

}

export default UserService;
