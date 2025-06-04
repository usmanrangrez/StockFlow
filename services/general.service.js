// Import necessary modules
import { Logger } from "../integrations/winston.js";
import { Codes } from "../config/codes.js";
import Sales from "../models/sales.models.js";
import Cartons from "../models/cartons.model.js";
import { Database } from "../integrations/database.js";
import Products from "../models/products.model.js";
import ProductVariants from "../models/productVariants.model.js";
import Colors from "../models/colors.model.js";
import Sizes from "../models/sizes.model.js";
import User from "../models/user.model.js";
import constants from "../config/constants.js";
const logger = new Logger();

const sequelize = Database.getSequelize();

class GeneralService {
  constructor() {
    this.sales = Sales;
    this.cartons = Cartons;
    this.products = Products;
    this.productsVariants = ProductVariants;
    this.color = Colors;
    this.sizes = Sizes;
    this.users = User;
  }

  async getAllDropDowns(dropDown) {
    try {
      if(dropDown){
        const validDropDowns = constants.validDropDowns;
        if (!validDropDowns.includes(dropDown)) {
          throw new Error(`Invalid dropdown type: ${dropDown}`);
        }
        return await this[dropDown].findAll();
      }
      const [users, products, colors, sizes, productsVariants, cartons] =
        await Promise.all([
          this.users.findAll({attributes:["id","username","email"]}),
          this.products.findAll({attributes:["id","code","name","brandId"]}),
          this.color.findAll({attributes:["id","name"]}),
          this.sizes.findAll({attributes:["id","sizeRange"]}),
          this.productsVariants.findAll({attributes:["id","productId","colorId","sizeRangeId"]}),
          this.cartons.findAll({attributes:["id","variantId","location","quantity"]}),
        ]);

      return {
        users,
        products,
        colors,
        sizes,
        productsVariants,
        cartons,
      };
    } catch (error) {
      logger.error(`GeneralService.getAllDropDowns: ${error}`);
      throw error;
    }
  }
}

export default GeneralService;
