import { Router } from "express";
const router = Router();
import CartonsController from "../controllers/cartons.controller.js";
const cartonsController = new CartonsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {cartonsSchema, updateCartonSchema } from "../schemas/cartons.schema.js";

router.post("/", validateSchema(cartonsSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, cartonsController.addCarton);
//this api is only used when we need to update the cartons quantity in one go or change the location
router.patch("/:cartonId", validateSchema(updateCartonSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, cartonsController.updateCarton);
router.patch("/:cartonId/:operation/adjustQuantity", verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, cartonsController.adjustCartonQuantity);
router.get("/", verifyToken, checkActiveUser, cartonsController.getAllCartons);

export default router;