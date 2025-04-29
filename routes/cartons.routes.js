import { Router } from "express";
const router = Router();
import CartonsController from "../controllers/cartons.controller.js";
const cartonsController = new CartonsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {cartonsSchema, updateCartonSchema } from "../schemas/cartons.schema.js";

// it's better if you keep stuff in single location
// if you dont want to keep stuff in single location then while using sales api when you sell a carton of qty 8
//  suppose 5 were on first floor and 3 were on second floor and 7 were on third floor
// the sales api will give in reponse updated cartons left on each floor and you should make sure that all cartons are in the same location
// otherwise get api will show wrong results

router.post("/", validateSchema(cartonsSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, cartonsController.addCarton);
//this api is only used when we need to update the cartons quantity in one go or change the location
router.patch("/:cartonId", validateSchema(updateCartonSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, cartonsController.updateCarton);
router.patch("/:cartonId/:operation/adjustQuantity", verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, cartonsController.adjustCartonQuantity);
router.get("/", verifyToken, checkActiveUser, cartonsController.getAllCartons);

export default router;