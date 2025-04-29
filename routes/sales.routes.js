import { Router } from "express";
const router = Router();
import SalesController from "../controllers/sales.controller.js";
const salesController = new SalesController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { salesSchema, updateSaleSchema } from "../schemas/sales.schema.js";

//bulk create sales in one go or create a single sale (note: only sale per single customer allowed in bulk and that too with a max of 20 sales) 
router.post("/", validateSchema(salesSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, salesController.registerSale);
router.get("/", verifyToken , checkActiveUser, salesController.getSales);
// api to update a single sale (note: use it mostly for updating total selling price))
// if you update quantity then check if quantity is increase or decrase
// in case decrease then update the lowest stock floor and + quantity
// in case increase then update the highest stock floor and - quantity
router.patch("/:saleId", validateSchema(updateSaleSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, salesController.updateSale);
//delete a single sale, but it is not recommended
router.delete("/:saleId", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, salesController.deleteSale);

export default router;