import { Router } from "express";
import { DefaultController } from "../controllers/default.controller.js";
import authRoutes from './auth.routes.js';

const defaultController = new DefaultController();

const router = Router();

router.get("/health", defaultController.healthCheck);
router.use("/auth",authRoutes);

export default router;
