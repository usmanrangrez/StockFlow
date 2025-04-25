import { Router } from "express";
const router = Router();
import AuthController from "../controllers/auth.controller.js";
const authController = new AuthController();

import { checkActiveUser, verifyRole, verifyToken } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { loginSchema, changePasswordSchema, resetPasswordSchema } from "../schemas/auth.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

router.post("/login", validateSchema(loginSchema), checkActiveUser, authController.login)
router.post("/changePassword", validateSchema(changePasswordSchema), verifyToken, checkActiveUser, authController.changePassword)
router.post("/resetPassword", validateSchema(resetPasswordSchema), verifyToken, checkActiveUser, verifyRole(constants.db.adminRole), authController.resetPassword)
router.post("/logout", verifyToken, checkActiveUser, authController.logout)


export default router;