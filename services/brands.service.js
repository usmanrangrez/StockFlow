import { Codes } from "../config/codes.js";
import { Logger } from "../integrations/winston.js";
import Brand from "../models/brands.model.js";

const logger = new Logger();

class BrandsService {
  constructor() {
    this.brand = Brand;
  }

  async createBrand(brandData) {
    try {
      const isBrandExists = await this.brand.findOne({
        where: { name: brandData.name },
      });
      if (isBrandExists) {
        logger.error(
          `BrandsService.createBrand: Brand with name ${brandData.name} already exists`
        );
        throw new Error(`Brand with name ${brandData.name} already exists`);
      }
      const brand = await this.brand.create(brandData);
      return brand;
    } catch (error) {
      logger.error(`BrandsService.createBrand: ${error.message}`);
      throw error;
    }
  }

  async getBrand(brandName) {
    try {
      if (brandName) {
        const brand = await this.brand.findOne({ where: { name: brandName } });
        if (!brand) {
          logger.error(`BrandsService.getBrand: Brand with name ${brandName} not found`);
          throw new Error(Codes.STX0030);
        }
        return brand;
      }
      const brands = await this.brand.findAndCountAll();
      if (brands.count === 0 || !brands.rows.length) throw new Error(Codes.STX0029);
      return brands;
    } catch (error) {
      logger.error(`BrandsService.getBrand: ${error.message}`);
      throw error;
    }
  }

  async updateBrand(brandName, data) {
    try {
      const brand = await this.brand.findOne({ where: { name: brandName } });
      if (!brand) {
        logger.error(`BrandsService.updateBrand: Brand with name ${brandName} not found`);
        throw new Error(Codes.STX0030);
      }
      const updatedBrand = await this.brand.update(data, { where: { name: brandName } });
      return { name: brandName };
    } catch (error) {
      logger.error(`BrandsService.updateBrand: ${error.message}`);
      throw error;
    }
  }

  async deleteBrand(brandName) {
    try {
      const brand = await this.brand.findOne({ where: { name: brandName } });
      if (!brand) {
        logger.error(`BrandsService.deleteBrand: Brand with name ${brandName} not found`);
        throw new Error(Codes.STX0030);
      }
      await this.brand.destroy({ where: { name: brandName } });
      return { name: brandName };
    } catch (error) {
      logger.error(`BrandsService.deleteBrand: ${error.message}`);
      throw error;
    }
  }

}

export default BrandsService;
