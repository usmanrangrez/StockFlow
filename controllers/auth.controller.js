import { Codes } from "../config/codes.js";
import AuthService from "../services/auth.service.js";

class AuthController {
    constructor() {
        this.authService = new AuthService()
    }

    register = async (req, res, next) => {
        try {
            const { username, email, password, role, active, phone } = req.body;
            const newUser = await this.authService.register(username, email, password, phone, role, active)

            res.status(201).json({ message: Codes.STX0003, data: { user: newUser } });
        } catch (error) {
            next(error);
        }
    }

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { username, accessToken } = await this.authService.login(email, password)

            res.status(200).json({ message: Codes.STX0004, data: { username, accessToken } });
        } catch (error) {
            next(error);
        }
    }

    changePassword = async (req, res, next) => {
        try {
            const { username, oldPassword, newPassword } = req.body;
            const data = await this.authService.changePassword(username, oldPassword, newPassword)

            res.status(201).json({ message: Codes.STX0013, data: { username: data.username } });
        } catch (error) {
            next(error);
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            const { username } = req.body;
            const data = await this.authService.resetPassword(username)

            res.status(201).json({ message: Codes.STX0013, data: { username: data.username } });
        } catch (error) {
            next(error);
        }
    }

    logout = async (req, res, next) => {
        try {
            const accessToken = req.headers.authorization.split(' ').pop()
            const data = await this.authService.logout(accessToken, req.user)
            res.status(200).json({ message: Codes.STX0007, username: data.username });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;