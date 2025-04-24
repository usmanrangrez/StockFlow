import { Router } from "express";
const router = Router();
import UserController from "../controllers/users.controller.js";
const userController = new UserController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { updateUserSchema } from "../schemas/users.schema.js";

router.get("/all", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, userController.getAllUsers);
router.get("/{:username}", verifyToken, verifyRole(constants.db.adminOnly, { restrictParamAccess: true }), checkActiveUser, userController.getDetails);
router.patch("/:username", validateSchema(updateUserSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, userController.editUser);
router.delete("/:username", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, userController.deleteUser);


export default router;