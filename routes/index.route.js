import { Router } from "express";
import { DefaultController } from "../controllers/default.controller.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import brandsRoutes from "./brands.routes.js";

const defaultController = new DefaultController();

const router = Router();

router.get("/health", defaultController.healthCheck);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/brands", brandsRoutes);

export default router;
