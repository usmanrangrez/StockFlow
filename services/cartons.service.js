import { Op } from "sequelize";
import { Codes } from "../config/codes.js";
import constants from "../config/constants.js";
import { Logger } from "../integrations/winston.js";
import Cartons from "../models/cartons.model.js";
import Products from "../models/products.model.js";
import ProductVariants from "../models/productVariants.model.js";
import Colors from "../models/colors.model.js";
import Sizes from "../models/sizes.model.js";
import { Database } from "../integrations/database.js";

const sequelize = Database.getSequelize();

const logger = new Logger();

class CartonsService {
  constructor() {
    this.cartons = Cartons;
    this.products = Products;
    this.productsVariants = ProductVariants;
    this.color = Colors;
    this.sizes = Sizes
  }

  async addCarton(body) {
    try {
      const carton = await this.cartons.create(body);
      return carton;
    } catch (error) {
      logger.error(`CartonsService.createCarton: ${error}`);
      throw error;
    }
  }

  async updateCarton(cartonId, body) {
    try {
      const carton = await this.cartons.findOne({ where: { id: cartonId } });
      if (!carton) {
        logger.error(
          `CartonsService.adjustCarton: Carton with id ${cartonId} not found`
        );
        throw new Error(Codes.STX0062);
      }
      await this.cartons.update(body, { where: { id: cartonId } });
      return carton;
    } catch (error) {
      logger.error(`CartonsService.adjustCarton: ${error}`);
      throw error;
    }
  }

  async adjustCartonQuantity(cartonId, operation) {
    try {
      const carton = await this.cartons.findOne({ where: { id: cartonId } });
      if (!carton) {
        logger.error(
          `CartonsService.decreaseCarton: Carton with id ${cartonId} not found`
        );
        throw new Error(Codes.STX0062);
      }
      if (
        carton.quantity === 0 &&
        operation === constants.db.operations.decrease
      )
        throw new Error(Codes.STX0064);
      if (operation === "increase") return await this.increaseCarton(carton);
      if (operation === "decrease") return await this.decreaseCarton(carton);
    } catch (error) {
      logger.error(`CartonsService.decreaseCarton: ${error}`);
      throw error;
    }
  }

  async increaseCarton(carton) {
    try {
      carton.quantity += 1;
      await carton.save();
      return carton;
    } catch (error) {
      logger.error(`CartonsService.increaseCarton: ${error}`);
      throw error;
    }
  }

  async decreaseCarton(carton) {
    try {
      carton.quantity -= 1;
      await carton.save();
      return carton;
    } catch (error) {
      logger.error(`CartonsService.decreaseCarton: ${error}`);
      throw error;
    }
  }

  async getAllCartons(limit, offset, location, productName) {
    try {
      const whereClause = {};
      if (location) whereClause.location = location;

      if (productName) {
        const productIds = await this.products.findAll({
          where: {
            name: {
              [Op.iLike]: `%${productName}%`,
            },
          },
          raw: true,
          attributes: ["id"],
        });

        const productVariants = await this.productsVariants.findAll({
          where: {
            productId: productIds.map((item) => item.id),
          },
          raw: true,
          attributes: ["id"],
        });

        whereClause.variantId = productVariants.map((item) => item.id);
      }

      const cartons = await this.cartons.findAndCountAll({
        limit,
        offset,
        where: whereClause,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: this.productsVariants,
            as: "variant",
            required: true,
            include: [
              {
                model: this.products,
                as: "product",
                attributes: ["name"],
                required: true,
              },
              {
                model: this.color,
                as: "color",
                attributes: ["name"],
                required: true,
              },
              {
                model: this.sizes,
                as: "sizeRange",
                attributes: ["sizeRange"],
                required: true,
              },
            ],
            attributes: ["mrp"],
            raw: true,
          },
        ],
        raw: true,
      });

      // if (!cartons.rows.length) throw new Error(Codes.STX0069);

      const cleanedRows = cartons.rows.map((row) => {
        const cleanRow = {
          id: row.id,
          variantId: row.variantId,
          quantity: row.quantity,
          pairsPerCarton: row.pairsPerCarton,
          location: row.location,
          created_at: row.created_at,
          updated_at: row.updated_at,
          mrp: row["variant.mrp"],
          productName: row["variant.product.name"],
          colorName: row["variant.color.name"],
          sizeRange: row["variant.sizeRange.sizeRange"],
        };
        return cleanRow;
      });

      return { count: cartons.count, rows: cleanedRows };
    } catch (error) {
      logger.error(`CartonsService.getAllCartons: ${error}`);
      throw error;
    }
  }


}

export default CartonsService;
