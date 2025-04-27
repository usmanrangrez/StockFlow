import { Router } from "express";
const router = Router();
import ProductsController from "../controllers/products.controller.js";
const productsController = new ProductsController();

import { verifyRole, verifyToken, checkActiveUser } from "../middlewares/auth.js";
import constants from "../config/constants.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { bulkProductSchema, productSchema, updateProductSchema} from "../schemas/products.schema.js";

router.post("/", validateSchema(productSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, productsController.createProduct);
router.post("/bulkCreate", validateSchema(bulkProductSchema), verifyToken, verifyRole(constants.db.adminOnly), checkActiveUser, productsController.createProducts);
router.get("/{:name}", verifyToken, checkActiveUser, productsController.getProducts);
router.delete ("/:name", verifyToken, checkActiveUser, productsController.deleteProduct);
router.patch("/:name", validateSchema(updateProductSchema), verifyToken, checkActiveUser, productsController.updateProduct);



export default router;