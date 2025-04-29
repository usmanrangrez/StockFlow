import { Router } from "express";
import { DefaultController } from "../controllers/default.controller.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import brandsRoutes from "./brands.routes.js";
import productsRoutes from "./products.routes.js"
import colorsRoutes from "./colors.routes.js"
import sizesRoutes from "./sizes.routes.js"
import productVariantRoutes from "./productsVariant.routes.js"
import cartonsRoutes from "./cartons.routes.js"
import customerRoutes from "./customer.routes.js"
import salesRoutes from "./sales.routes.js"

const defaultController = new DefaultController();

const router = Router();

router.get("/health", defaultController.healthCheck);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/brands", brandsRoutes);
router.use("/products", productsRoutes);
router.use("/colors", colorsRoutes);
router.use("/sizes", sizesRoutes);
router.use("/productVariants", productVariantRoutes);
router.use("/cartons", cartonsRoutes);
router.use("/customer", customerRoutes);
router.use("/sales", salesRoutes);

export default router;
