import { Router } from "express";
const router = new Router();


router.post("/add", validateBrand, brandsController.createBrand);