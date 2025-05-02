import { Router } from "express";
const router = Router();
import GeneralController from "../controllers/general.controller.js";
const generalController = new GeneralController();

import { verifyToken, checkActiveUser } from "../middlewares/auth.js";

router.get("/", verifyToken , checkActiveUser, generalController.getAllDropDowns);

export default router;