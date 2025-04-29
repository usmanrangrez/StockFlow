import { Codes } from "../config/codes.js";
import constants from "../config/constants.js";
import { getPaginationParams } from "../helpers/getPagination.helper.js";
import CartonsService from "../services/cartons.service.js";

class CartonsController {
  constructor() {
    this.cartonsService = new CartonsService();
  }

  addCarton = async (req, res, next) => {
    try {
      const body = req.body;
      const carton = await this.cartonsService.addCarton(body);
      res.sendSuccess(201, Codes.STX0060, carton);
    } catch (error) {
      next(error);
    }
  };

  updateCarton = async (req, res, next) => {
    try {
      const cartonId = req.params.cartonId;
      const body = req.body;
      const carton = await this.cartonsService.updateCarton(cartonId, body);
      res.sendSuccess(201, Codes.STX0061, carton);
    } catch (error) {
      next(error);
    }
  };

  adjustCartonQuantity = async (req, res, next) => {
    try {
      const cartonId = req.params.cartonId;
      const operation = req.params.operation;
      if(!cartonId || !operation) throw new Error(Codes.STX0067);
      if(operation !== constants.db.operations.increase && operation !== constants.db.operations.decrease) throw new Error(Codes.STX0066);
      const carton = await this.cartonsService.adjustCartonQuantity(cartonId,operation);
      res.sendSuccess(201, Codes.STX0063, carton);
    } catch (error) {
      next(error);
    }
  };

  getAllCartons = async (req, res, next) => {
    try {
      let { limit = 10, offset = 0} = getPaginationParams(req);
      let { location, productName } = req.query;
      productName = productName?.trim();
      const cartons = await this.cartonsService.getAllCartons(limit, offset, location, productName);
      res.sendSuccess(200, Codes.STX0068, cartons);
    } catch (error) {
      next(error);
    }
  };
  
}

export default CartonsController;
