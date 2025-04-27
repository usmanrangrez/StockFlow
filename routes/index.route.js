import { Router } from "express";
import { DefaultController } from "../controllers/default.controller.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import brandsRoutes from "./brands.routes.js";
import productsRoutes from "./products.routes.js"
import colorsRoutes from "./colors.routes.js"
import sizesRoutes from "./sizes.routes.js"

const defaultController = new DefaultController();

const router = Router();

router.get("/health", defaultController.healthCheck);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/brands", brandsRoutes);
router.use("/products", productsRoutes);
router.use("/colors", colorsRoutes);
router.use("/sizes", sizesRoutes);

export default router;
