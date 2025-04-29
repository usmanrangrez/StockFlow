import { Codes } from "../config/codes.js";
import { getPaginationParams } from "../helpers/getPagination.helper.js";
import ProductsVariantsService from "../services/productsVariant.service.js";

class ProductsVariantsController {
  constructor() {
    this.productsVariantsService = new ProductsVariantsService();
  }

  createVariant = async (req, res, next) => {
    try {
      const body = req.body;
      const productVariant = await this.productsVariantsService.createVariant(body);
      res.sendSuccess(201, Codes.STX0053, productVariant);
    } catch (error) {
      next(error);
    }
  };

  updateVariant = async (req, res, next) => {
    try {
      const variantId = req.params.variantId;
      const body = req.body;
      const productVariant = await this.productsVariantsService.updateVariant(variantId, body);
      res.sendSuccess(201, Codes.STX0054, productVariant);
    } catch (error) {
      next(error);
    }
  };

  getVariants = async (req, res, next) => {
    try {
      let { limit = 10, offset = 0} = getPaginationParams(req)
      const variantId = req?.params?.variantId;
      const productVariant = await this.productsVariantsService.getVariants(variantId,limit,offset);
      res.sendSuccess(200, Codes.STX0056, productVariant);
    } catch (error) {
      next(error);
    }
  };

  deleteVariant = async (req, res, next) => {
    try {
      const variantId = req.params.variantId;
      const productVariant = await this.productsVariantsService.deleteVariant(variantId);
      res.sendSuccess(200, Codes.STX0059, productVariant);
    } catch (error) {
      next(error);
    }
  };

}

export default ProductsVariantsController;
