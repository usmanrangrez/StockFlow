import { Codes } from "../config/codes.js";
import UserService from "../services/user.service.js";

class UserController {
    constructor() {
        this.userService = new UserService()
    }

    getDetails = async (req, res, next) => {
        try {
            const username = req.params.username || req.user.username;
            const user = await this.userService.getDetails(username);
            res.sendSuccess(200, Codes.STX0018, user);
        } catch (error) {
            next(error);
        }
    }

    editUser = async (req, res, next) => {
        try {
            const username = req.params.username;
            const data = req.body;
            const user = await this.userService.editUser(username, data);
            res.sendSuccess(200, Codes.STX0022, user);
        } catch (error) {
            next(error);
        }
    }

    deleteUser = async (req, res, next) => {
        try {
            const username = req.params.username;
            const user = await this.userService.deleteUser(username);
            res.sendSuccess(200, Codes.STX0025, user);
        } catch (error) {
            next(error);
        }
    }

    getAllUsers = async (req, res, next) => {
        try {
            const users = await this.userService.getAllUsers();
            res.sendSuccess(200, Codes.STX0019, users);
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;