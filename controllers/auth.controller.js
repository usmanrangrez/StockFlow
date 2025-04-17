import { Codes } from "../config/codes.js";
import constants from "../config/constants.js";
import AuthService from "../services/auth.service.js";

class AuthController {
    constructor() {
        this.authService = new AuthService()
    }

    register = async (req, res) => {
        try {
            const { username, email, password, role, active } = req.body;
            const newUser = await this.authService.register(username, email, password, role, active)

            res.status(201).json({ message: Codes.STX0003, data: { user: newUser } });
        } catch (error) {
            res.status(500).json({ message: Codes.STX0010, error: error.message });
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const { username, accessToken } = await this.authService.login(email, password)

            res.status(200).json({ message: Codes.STX0004, data: { username, accessToken } });
        } catch (error) {
            res.status(500).json({ message: Codes.STX0008, error: error.message });
        }
    }

    logout = async (req, res) => {
        try {
            const accessToken = req.headers.authorization.split(' ').pop();
            const data = await this.authService.logout(accessToken)

            res.status(200).json({ message: Codes.STX0007, username: data.userId || "" });
        } catch (error) {
            res.status(500).json({ message: Codes.STX0009, error: error.message });
        }
    }
}

export default AuthController;