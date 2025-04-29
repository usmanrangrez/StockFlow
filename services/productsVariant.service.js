import { Codes } from "../config/codes.js";
import { Logger } from "../integrations/winston.js";
import ProductsVariants from "../models/productVariants.model.js";

const logger = new Logger();

class ProductVariantsService {
  constructor() {
    this.productVariants = ProductsVariants;
  }

  async createVariant(body) {
    try {
      const existingVariant = await this.productVariants.findOne({
        where: {
          productId: body.productId,
          colorId: body.colorId,
          sizeRangeId: body.sizeRangeId,
        },
      });
      if (existingVariant)
        throw new Error(
          `Variant with productId ${body.productId}, colorId ${body.colorId} and sizeRangeId ${body.sizeRangeId} already exists`
        );

      const createdVariant = await this.productVariants.create(body);
      return createdVariant;
    } catch (error) {
      logger.error(`ProductVariantsService.createSize: ${error}`);
      throw error;
    }
  }

  async updateVariant(id, body) {
    try {
      const variant = await this.productVariants.findOne({ where: { id } });
      if (!variant) throw new Error(`Variant with id ${id} not found`);

      await this.productVariants.update(body, { where: { id } });
      return { id };
    } catch (error) {
      logger.error(`ProductVariantsService.updateSize: ${error}`);
      throw error;
    }
  }
  
  async getVariants(id,limit,offset) {
    try {
      if (id) {
        const variants = await this.productVariants.findAll({ where: { id } });
        if (!variants.length) throw new Error(Codes.STX0058);
        return variants;
      }
      const variants = await this.productVariants.findAndCountAll({ limit, offset });
      // if(variants.count === 0 || !variants.rows.length) throw new Error(Codes.STX0057);
      return variants;
    } catch (error) {
      logger.error(`ProductVariantsService.getAllSizes: ${error}`);
      throw error;
    }
  }

  async deleteVariant(id) {
    try {
      const variant = await this.productVariants.findOne({ where: { id } });
      if (!variant) throw new Error(`Variant with id ${id} not found`);

      await this.productVariants.destroy({ where: { id } });
      return { id };
    } catch (error) {
      logger.error(`ProductVariantsService.deleteSize: ${error}`);
      throw error;
    }
  }


  async getProductVariantIdFromCombination(productId,colorId,sizeRangeId) {
    try {
      const productVariant = await this.productVariants.findOne({ where: { productId, colorId, sizeRangeId } });
      if (!productVariant) {
        logger.error(`ProductsService.getProductVariantIdFromCombination: Variant with productId ${productId}, colorId ${colorId} and sizeRangeId ${sizeRangeId} not found`);
        throw new Error(Codes.STX0057);
      }
      return productVariant;
    } catch (error) {
      logger.error(`ProductsService.getProductVariantIdFromCombination: ${error.message}`);
      throw error;
    }
  }
}

export default ProductVariantsService;
