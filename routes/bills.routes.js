import { Router } from "express";
const router = Router();
import BillsController from "../controllers/bills.controller.js";
const billsController = new BillsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { billsSchema, generateBillForSaleSchema } from "../schemas/bills.schema.js";

router.post("/", validateSchema(billsSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, billsController.generateBill);

//from ui select multiple sales and generate bill (use this when cusstomer asks his previous sales)
router.post("/multipleSales", validateSchema(generateBillForSaleSchema),verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, billsController.generateBillForSale);




export default router;