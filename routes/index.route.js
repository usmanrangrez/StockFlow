import { Router } from "express";
import { DefaultController } from "../controllers/default.controller.js";

const defaultController = new DefaultController();

const router = Router();

router.get("/test", defaultController.healthCheck);

export default router;
