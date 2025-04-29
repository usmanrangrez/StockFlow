import { Router } from "express";
const router = Router();
import CustomersController from "../controllers/customers.controller.js";
const customersController = new CustomersController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customersSchema, updateCustomerSchema } from "../schemas/customers.schema.js";

router.post("/", validateSchema(customersSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, customersController.createCustomer);
router.get("/", verifyToken, checkActiveUser, customersController.getCustomers);
router.patch("/:customerId", validateSchema(updateCustomerSchema), verifyToken, verifyRole(constants.db.adminCumManager), checkActiveUser, customersController.updateCustomer);
router.delete("/:customerId", verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, customersController.deleteCustomer);


export default router;