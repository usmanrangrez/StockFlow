import { Router } from "express";
const router = Router();
import AuthController from "../controllers/auth.controller.js";
const authController = new AuthController();

import { verifyRole, verifyToken } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { registerSchema, loginSchema, changePasswordSchema, resetPasswordSchema } from "../schemas/auth.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

router.post("/login", validateSchema(loginSchema), authController.login)
router.post("/register", validateSchema(registerSchema), verifyToken, authController.register)
router.post("/changePassword", validateSchema(changePasswordSchema), verifyToken, authController.changePassword)
router.post("/resetPassword", validateSchema(resetPasswordSchema), verifyToken, verifyRole(constants.db.resetPasswordRoles), authController.resetPassword)
router.post("/logout", verifyToken, authController.logout)


export default router;