import { Codes } from "../config/codes.js";
import ProductsService from "../services/products.service.js";

class ProductsController {
  constructor() {
    this.productsService = new ProductsService();
  }

  createProduct = async (req, res, next) => {
    try {
      const body = req.body;
      const product = await this.productsService.createProduct(body);
      res.sendSuccess(201, Codes.STX0033, product);
    } catch (error) {
      next(error);
    }
  };

  createProducts = async (req, res, next) => {
    try {
      const productsArray = req.body;
      const products = await this.productsService.createProducts(productsArray);
      res.sendSuccess(201, Codes.STX0034, products);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req, res, next) => {
    try {
      const productId = req?.params?.productId;
      const products = await this.productsService.getProducts(productId);
      res.sendSuccess(200, Codes.STX0035, products);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await this.productsService.deleteProduct(productId);
      res.sendSuccess(201, Codes.STX0038, product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const body = req.body;
      const product = await this.productsService.updateProduct(productId, body);
      res.sendSuccess(201, Codes.STX0039, product);
    } catch (error) {
      next(error);
    }
  };

  
}

export default ProductsController;
