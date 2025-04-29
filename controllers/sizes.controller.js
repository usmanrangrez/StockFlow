import { Codes } from "../config/codes.js";
import SizesService from "../services/sizes.service.js";

class SizesController {
  constructor() {
    this.sizesService = new SizesService();
  }

  createSize = async (req, res, next) => {
    try {
      const body = req.body;
      const sizeRange = await this.sizesService.createSize(body);
      res.sendSuccess(201, Codes.STX0046, sizeRange);
    } catch (error) {
      next(error);
    }
  };

  updateSize = async (req, res, next) => {
    try {
      const sizeId = req.params.sizeId;
      const body = req.body;
      const sizeRange = await this.sizesService.updateSize(sizeId, body);
      res.sendSuccess(200, Codes.STX0047, sizeRange);
    } catch (error) {
      next(error);
    }
  };

  getAllSizes = async (req, res, next) => {
    try {
      const body = req.body;
      const sizeRanges = await this.sizesService.getAllSizes(body);
      res.sendSuccess(200, Codes.STX0048, sizeRanges);
    } catch (error) {
      next(error);
    }
  };

  deleteSize = async (req, res, next) => {
    try {
      const sizeId = req.params.id;
      const sizeRange = await this.sizesService.deleteSize(sizeId);
      res.sendSuccess(200, Codes.STX0051, sizeRange);
    } catch (error) {
      next(error);
    }
  };

  
}

export default SizesController;
