import { Router } from "express";
const router = Router();
import AuthController from "../controllers/auth.controller.js";
const authController = new AuthController();

import { validateRegister, validateLogin } from "../middlewares/joi.js";

router.post("/register", validateRegister, authController.register)
router.post("/login", validateLogin, authController.login)
router.post("/logout", authController.logout)

export default router;