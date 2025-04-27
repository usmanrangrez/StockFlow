import { Router } from "express";
const router = Router();
import SizesController from "../controllers/sizes.controller.js";
const sizesController = new SizesController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { sizesSchema, updateSizeSchema } from "../schemas/sizes.schema.js";

router.post("/", validateSchema(sizesSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, sizesController.createSize);
router.patch("/", validateSchema(updateSizeSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, sizesController.updateSize);
router.get("/", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, sizesController.getAllSizes);
router.delete("/:id", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, sizesController.deleteSize);




export default router;