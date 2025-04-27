import { Codes } from "../config/codes.js";
import { Logger } from "../integrations/winston.js";
import Products from "../models/products.model.js";

const logger = new Logger();

class ProductsService {
  constructor() {
    this.product = Products;
  }


  async createProduct(product) {
    try {
      const existingProduct = await this.product.findOne({ where: { name: product.name.trim() } });
      if (existingProduct) throw new Error(`Product with name ${product.name} already exists`);
 
  
      const createdProduct = await this.product.create(product);
      return createdProduct;
    } catch (error) {
      logger.error(`ProductsService.createProduct: ${error}`);
      throw error;
    }
  }


  async createProducts(productsArray) {
    try {
      if (!Array.isArray(productsArray) || productsArray.length === 0) throw new Error("Invalid input: productsArray should be a non-empty array");
  
      const productNames = productsArray.map(product => product.name);
      const existingProducts = await this.product.findAll({
        where: {
          name: productNames, 
        },
      });
  
      if (existingProducts.length > 0){
        const existingProductNames = existingProducts.map(product => product.name);
        const duplicateProducts = productsArray.filter(product => existingProductNames.includes(product.name));
        throw new Error(`Duplicate products found: ${duplicateProducts.map(product => product.name).join(", ")}`);
      }
      
  
      const createdProducts = await this.product.bulkCreate(productsArray);
      return createdProducts;
      
    } catch (error) {
      logger.error(`ProductsService.createProducts: ${error.message}`);
      throw error;
    }
  }

  async getProducts(productName) {
    try {
      if (productName) {
        const product = await this.product.findOne({ where: { name: productName } });
        if (!product) {
          logger.error(`ProductsService.getProducts: Brand with name ${productName} not found`);
          throw new Error(Codes.STX0036);
        }
        return product;
      }
      const products = await this.product.findAndCountAll();
      if (products.count === 0 || !products.rows.length) throw new Error(Codes.STX0037);
      return products;
    } catch (error) {
      logger.error(`ProductsService.getProducts: ${error.message}`);
      throw error;
    }
  }

  async deleteProduct(productName) {
    try {
      const product = await this.product.findOne({ where: { name: productName } });
      if (!product) {
        logger.error(`ProductsService.deleteProduct: Product with name ${productName} not found`);
        throw new Error(Codes.STX0036);
      }
  
      await product.destroy();
      return  { name: productName };
    } catch (error) {
      logger.error(`ProductsService.deleteProduct: ${error.message}`);
      throw error;
    }
  }

  async updateProduct(productName, data) {
    try {
      const product = await this.product.findOne({ where: { name: productName } });
      if (!product) {
        logger.error(`ProductsService.updateProduct: Product with name ${productName} not found`);
        throw new Error(Codes.STX0036);
      }
  
      await product.update(data);
      return { name: productName };
    } catch (error) {
      logger.error(`ProductsService.updateProduct: ${error.message}`);
      throw error;
    }
  }
  

}

export default ProductsService;
