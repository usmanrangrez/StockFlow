import { Codes } from "../config/codes.js";
import { getPaginationParams } from "../helpers/getPagination.helper.js";
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
      const colorId = req.params.colorId;
      const body = req.body;
      const color = await this.colorService.updateColor(colorId, body);
      res.sendSuccess(201, Codes.STX0041, color);
    } catch (error) {
      next(error);
    }
  };

  deleteColor = async (req, res, next) => {
    try {
      const colorId = req.params.colorId;
      const color = await this.colorService.deleteColor(colorId);
      res.sendSuccess(201, Codes.STX0042, color);
    } catch (error) {
      next(error);
    }
  };

  getColors = async (req, res, next) => {
    try {
      let { limit = 10, offset = 0} = getPaginationParams(req);
      const colorId = req?.params?.colorId;
      const color = await this.colorService.getColors(colorId,limit,offset);
      res.sendSuccess(200, Codes.STX0043, color);
    } catch (error) {
      next(error);
    }
  };
  
}

export default ColorsController;
