import { Router } from "express";
import { DefaultController } from "../controllers/default.controller.js";
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';

const defaultController = new DefaultController();

const router = Router();

router.get("/health", defaultController.healthCheck);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

export default router;
