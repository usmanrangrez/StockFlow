import { Codes } from "../config/codes.js";
import BrandsService from "../services/brands.service.js";

class BrandsController {
  constructor() {
    this.brandsService = new BrandsService();
  }

  createBrand = async (req, res, next) => {
    try {
      const body = req.body;
      const brand = await this.brandsService.createBrand(body);
      res.sendSuccess(201, Codes.STX0027, brand);
    } catch (error) {
      next(error);
    }
  };

  getBrands = async (req, res, next) => {
    try {
      const brandName = req?.params?.name;
      const brand = await this.brandsService.getBrand(brandName);
      res.sendSuccess(200, Codes.STX0028, brand);
    } catch (error) {
      next(error);
    }
  };

  updateBrand = async (req, res, next) => {
    try {
      const brandName = req?.params?.name;
      const body = req.body;
      const brand = await this.brandsService.updateBrand(brandName, body);
      res.sendSuccess(201, Codes.STX0031, brand);
    } catch (error) {
      next(error);
    }
  };

  deleteBrand = async (req, res, next) => {
    try {
      const brandName = req?.params?.name;
      const brand = await this.brandsService.deleteBrand(brandName);
      res.sendSuccess(201, Codes.STX0032, brand);
    } catch (error) {
      next(error);
    }
  };
}

export default BrandsController;
