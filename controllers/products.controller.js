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
      const name = req?.params?.name;
      const products = await this.productsService.getProducts(name);
      res.sendSuccess(200, Codes.STX0035, products);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const name = req.params.name;
      const product = await this.productsService.deleteProduct(name);
      res.sendSuccess(201, Codes.STX0038, product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const name = req.params.name;
      const body = req.body;
      const product = await this.productsService.updateProduct(name, body);
      res.sendSuccess(201, Codes.STX0039, product);
    } catch (error) {
      next(error);
    }
  };

  
}

export default ProductsController;
