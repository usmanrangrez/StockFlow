// Import necessary modules
import { Op } from "sequelize";
import { Logger } from "../integrations/winston.js";
import { Codes } from "../config/codes.js";
import Sales from "../models/sales.models.js";
import ProductVariantsService from "./productsVariant.service.js";
import Cartons from "../models/cartons.model.js";
import { Database } from "../integrations/database.js";
import Products from "../models/products.model.js";
import ProductVariants from "../models/productVariants.model.js";
import Colors from "../models/colors.model.js";
import Sizes from "../models/sizes.model.js";
const logger = new Logger();

const sequelize = Database.getSequelize();

class SalesService {
  constructor() {
    this.sales = Sales;
    this.cartons = Cartons;
    this.productVariantsService = new ProductVariantsService();
  }

  // Function to check if all sales are for the same customer
  validateSameCustomer(body) {
    const firstCustomer = body[0]?.customerId;
    if (!body.every((sale) => sale.customerId === firstCustomer)) {
      throw new Error(Codes.STX0076);
    }
  }

  // Function to check if inventory is available for all sales
  async checkInventoryAvailability(body, t) {
    for (const sale of body) {
      const { productId, colorId, sizeRangeId, quantity } = sale;
      const productVariant =
        await this.productVariantsService.getProductVariantIdFromCombination(
          productId,
          colorId,
          sizeRangeId
        );

      const cartons = await this.cartons.findAll({
        where: { variantId: productVariant.id },
        transaction: t,
      });

      const totalAvailable = cartons.reduce(
        (sum, carton) => sum + carton.quantity,
        0
      );
      if (totalAvailable < quantity) {
        throw new Error(
          `Insufficient inventory for product variant ${productVariant.id}. Available: ${totalAvailable}, Requested: ${quantity}`
        );
      }
    }
  }

  // Function to process each sale and update inventory
  async processSale(sale, t, affectedVariants,user) {
    const {
      productId,
      colorId,
      sizeRangeId,
      customerId,
      quantity,
      totalSellingPrice,
    } = sale;
    const productVariant =
      await this.productVariantsService.getProductVariantIdFromCombination(
        productId,
        colorId,
        sizeRangeId
      );

    affectedVariants.add(productVariant.id);

    const cartons = await this.cartons.findAll({
      where: { variantId: productVariant.id },
      order: [["quantity", "DESC"]],
      transaction: t,
    });

    let remainingQuantity = quantity;
    for (const carton of cartons) {
      if (remainingQuantity <= 0) break;

      // explanation: if remainingQuantity is greater than carton quantity, then all cartons will be used
      // if remainingQuantity is less than carton quantity, then only that much cartons will be used
      const newQty = Math.max(0, carton.quantity - remainingQuantity);
      const usedQty = Math.min(carton.quantity, remainingQuantity);

      await this.cartons.update(
        { quantity: newQty },
        {
          where: { id: carton.id },
          transaction: t,
        }
      );

      remainingQuantity -= usedQty;
    }

    const totalMrp = productVariant.mrp * quantity;

    // Create sale record
    return this.sales.create(
      {
        customerId,
        productVariantId: productVariant.id,
        quantity,
        soldBy: user.userId,
        totalMrp,
        totalSellingPrice,
      },
      { transaction: t }
    );
  }

  // Function to build inventory summary by variant
  async buildInventorySummary(affectedVariants, t) {
    const inventorySummary = [];

    for (const variantId of affectedVariants) {
      const updatedCartons = await this.cartons.findAll({
        where: { variantId },
        attributes: ["location", "quantity"],
        include: [
          {
            model: ProductVariants,
            attributes: ["productId", "colorId", "sizeRangeId"],
            as: "variant",
            include: [
              { model: Products, attributes: ["name"], as: "product" },
              { model: Colors, attributes: ["name"], as: "color" },
              { model: Sizes, attributes: ["sizeRange"], as: "sizeRange" },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
        transaction: t,
        raw: true,
      });

      if (updatedCartons.length === 0) continue;

      const first = updatedCartons[0];

      const byFloor = {};
      let totalRemaining = 0;

      for (const row of updatedCartons) {
        byFloor[row.location] = (byFloor[row.location] || 0) + row.quantity;
        totalRemaining += row.quantity;
      }

      inventorySummary.push({
        product: first["variant.product.name"],
        color: first["variant.color.name"],
        sizeRange: first["variant.sizeRange.sizeRange"],
        byFloor,
        totalRemaining,
      });
    }

    return inventorySummary;
  }

  // Main function to register the sale
  async registerSale(body, user) {
    const t = await sequelize.transaction();
    try {
      const saleRecords = [];
      const affectedVariants = new Set();

      // Ensure all sales are for the same customer
      this.validateSameCustomer(body);

      // Pre-check stock availability
      await this.checkInventoryAvailability(body, t);

      // Process each sale and create sale records
      for (const sale of body) {
        const saleRecord = await this.processSale(sale, t, affectedVariants,user);
        saleRecords.push(saleRecord);
      }

      // Build inventory summary
      const inventorySummary = await this.buildInventorySummary(
        affectedVariants,
        t
      );

      await t.commit();

      return {
        note: Codes.STX0081,
        sales: saleRecords,
        inventorySummary,
      };
    } catch (error) {
      await t.rollback();
      logger.error(`SalesService.registerSale Error: ${error.message}`, error);
      throw error;
    }
  }

  async getSales(limit, offset, customerId, productVariantId) {
    const whereClause = {};
    if (customerId) whereClause.customerId = customerId;
    if (productVariantId) whereClause.productVariantId = productVariantId;
    const sales = await this.sales.findAndCountAll({
      include: [
        {
          model: ProductVariants,
          attributes: ["productId", "colorId", "sizeRangeId"],
          as: "variant",
          include: [
            { model: Products, attributes: ["name"], as: "product",required:true },
            { model: Colors, attributes: ["name"], as: "color",required:true },
            { model: Sizes, attributes: ["sizeRange"], as: "sizeRange",required:true },
          ],
        },
      ],
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const cleanedRows = sales?.rows.map((s) => {
      return {
        ...s.toJSON?.(),
        variant: {
          ...s.variant.toJSON(),
          product: s.variant.product.name,
          color: s.variant.color.name,
          sizeRange: s.variant.sizeRange.sizeRange,
        },
      };
    });
    
    return { count: sales.count, rows: cleanedRows };
  }
  async updateSale(saleId, body) {
    const t = await sequelize.transaction();
    try {
      const sale = await this.sales.findByPk(saleId);
      if (!sale) throw new Error(Codes.STX0079);
  
      const updatedSale = await this.sales.update(body, {
        where: { id: saleId },
        transaction: t,
        returning: true,
      });
  
      const oldQuantity = sale.quantity;
      const newQuantity = body.quantity;
  
      if (oldQuantity !== newQuantity) {
        const diff = Math.abs(oldQuantity - newQuantity);
  
        const cartons = await this.cartons.findAll({
          where: { variantId: sale.productVariantId },
          transaction: t,
          raw:true
        });
  
        if (!cartons.length) throw new Error("No cartons found for this variant");
  
        const totalAvailable = cartons.reduce(
          (sum, carton) => sum + carton.quantity,
          0
        );
  
        if (newQuantity > oldQuantity && totalAvailable < diff) {
          throw new Error(
            `Insufficient inventory for product variant ${sale.productVariantId}. Available: ${totalAvailable}, Requested: ${diff}`
          );
        }
  
        if (oldQuantity > newQuantity) {
          // Sale reduced ⇒ restock ⇒ increment cartons at lowest quantity location
          const sorted = cartons.sort((a, b) => a.quantity - b.quantity);
          const targetLocation = sorted[0].location;
  
          await this.cartons.increment("quantity", {
            by: diff,
            where: {
              variantId: sale.productVariantId,
              location: targetLocation,
            },
            transaction: t,
          });
        } else {
          // Sale increased ⇒ more stock sold ⇒ decrement cartons from highest quantity first
          let remaining = diff;
          const sorted = cartons.sort((a, b) => b.quantity - a.quantity);
  
          for (const carton of sorted) {
            if (remaining <= 0) break;
            const deduct = Math.min(carton.quantity, remaining);
            await this.cartons.decrement("quantity", {
              by: deduct,
              where: {
                variantId: sale.productVariantId,
                location: carton.location,
              },
              transaction: t,
            });
            remaining -= deduct;
          }
  
          if (remaining > 0) {
            throw new Error(
              `Unexpected inventory shortfall. Could not decrement full amount: ${diff}, remaining: ${remaining}`
            );
          }
        }
      }
  
      await t.commit();
      return { note: Codes.STX0080, sale: updatedSale[1][0] };
    } catch (error) {
      await t.rollback();
      logger.error(`SalesService.updateSale Error: ${error.message}`, error);
      throw error;
    }
  }

  async deleteSale(saleId) {
    const t = await sequelize.transaction();
    try {
      const sale = await this.sales.findByPk(saleId);
      if (!sale) throw new Error(Codes.STX0079);
      await sale.destroy();

      //now add back stock
      const cartons = await this.cartons.findAll({
        where: { variantId: sale.productVariantId },
        raw:true,
        order: [["quantity", "DESC"]],
        transaction: t,
      });
  
      if (!cartons.length || cartons.length === 0) throw new Error("No cartons found for this variant");
      
      const targetLocation = cartons[0].location;
      await this.cartons.increment("quantity", {
        by: sale.quantity,
        where: {
          variantId: sale.productVariantId,
          location: targetLocation,
        },
        transaction: t,
      });

      await t.commit();
      return { note: `${Codes.STX0082},You are requested to add a carton to location ${targetLocation}`, };
    } catch (error) {
      await t.rollback();
      logger.error(`SalesService.deleteSale Error: ${error.message}`, error);
      throw error;
    }
  }
  
}

export default SalesService;
