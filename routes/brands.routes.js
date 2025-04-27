import { Router } from "express";
const router = Router();
import BrandsController from "../controllers/brands.controller.js";
const brandsController = new BrandsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { brandsSchema, updateBrandSchema } from "../schemas/brands.schema.js";

router.post("/", validateSchema(brandsSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, brandsController.createBrand);
router.get("/{:brandId}", verifyToken, checkActiveUser, brandsController.getBrands);
router.patch("/:brandId", validateSchema(updateBrandSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, brandsController.updateBrand);
router.delete("/:brandId", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, brandsController.deleteBrand);


export default router;