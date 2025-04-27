import { Router } from "express";
const router = Router();
import ColorsController from "../controllers/colors.controller.js";
const colorsController = new ColorsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { colorsSchema, updateColorSchema } from "../schemas/colors.schema.js";

router.post("/", validateSchema(colorsSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, colorsController.createColor);
router.patch("/:name", validateSchema(updateColorSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, colorsController.updateColor);
router.delete("/:name", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, colorsController.deleteColor);
router.get("/{:name}", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, colorsController.getColors);


export default router;