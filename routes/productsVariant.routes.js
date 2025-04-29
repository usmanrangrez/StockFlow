import { Router } from "express";
const router = Router();
import ProductsVariantsController from "../controllers/productVariant.controller.js";
const productsVariantsController = new ProductsVariantsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createVariant, updateVariant } from "../schemas/productsVariant.schema.js";

router.post("/", validateSchema(createVariant), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, productsVariantsController.createVariant);
router.patch("/:variantId", validateSchema(updateVariant), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, productsVariantsController.updateVariant);
router.get("/{:variantId}", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, productsVariantsController.getVariants);
router.delete("/:variantId", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, productsVariantsController.deleteVariant);



export default router;