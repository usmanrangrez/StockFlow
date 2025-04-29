import { Codes } from "../config/codes.js";
import { getPaginationParams } from "../helpers/getPagination.helper.js";
import SalesService from "../services/sales.service.js";

class SalesController {
  constructor() {
    this.salesService = new SalesService();
  }

  //always enter sales in array
  registerSale = async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user;

      //note: if you enter multiple sales stock will be deducted from floors in order of higher to lower
      const sales = await this.salesService.registerSale(body,user);
      res.sendSuccess(201, Codes.STX0075, sales);
    } catch (error) {
      next(error);
    }
  };

  getSales = async (req, res, next) => {
    try {
      const { customerId, productVariantId } = req.query;
      let { limit, offset } = getPaginationParams(req);
      const sales = await this.salesService.getSales(limit, offset, customerId, productVariantId);
      res.sendSuccess(200, Codes.STX0077, sales);
    } catch (error) {
      next(error);
    }
  };

  updateSale = async (req, res, next) => {
    try {
      const saleId = req.params.saleId;
      const body = req.body;
      const sale = await this.salesService.updateSale(saleId, body);
      res.sendSuccess(201, Codes.STX0078, sale);
    } catch (error) {
      next(error);
    }
  };

  deleteSale = async (req, res, next) => {
    try {
      const saleId = req.params.saleId;
      const sale = await this.salesService.deleteSale(saleId);
      res.sendSuccess(201, Codes.STX0082, sale);
    } catch (error) {
      next(error);
    }
  };

  
}

export default SalesController;
