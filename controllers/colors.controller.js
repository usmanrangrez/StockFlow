import { Codes } from "../config/codes.js";
import ColorsService from "../services/colors.service.js";

class ColorsController {
  constructor() {
    this.colorService = new ColorsService();
  }

  createColor = async (req, res, next) => {
    try {
      const body = req.body;
      const color = await this.colorService.createColor(body);
      res.sendSuccess(201, Codes.STX0040, color);
    } catch (error) {
      next(error);
    }
  };

  updateColor = async (req, res, next) => {
    try {
      const name = req.params.name;
      const body = req.body;
      const color = await this.colorService.updateColor(name, body);
      res.sendSuccess(201, Codes.STX0041, color);
    } catch (error) {
      next(error);
    }
  };

  deleteColor = async (req, res, next) => {
    try {
      const name = req.params.name;
      const color = await this.colorService.deleteColor(name);
      res.sendSuccess(201, Codes.STX0042, color);
    } catch (error) {
      next(error);
    }
  };

  getColors = async (req, res, next) => {
    try {
      const colorName = req?.params?.name;
      const color = await this.colorService.getColors(colorName);
      res.sendSuccess(200, Codes.STX0043, color);
    } catch (error) {
      next(error);
    }
  };
  
}

export default ColorsController;
