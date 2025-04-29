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
      const isBrandExists = await this.brand.findOne({ where: { name: brandData.name } });
      if (isBrandExists) {
        logger.error(
          `BrandsService.createBrand: Brand with name ${brandData.name} already exists`
        );
        throw new Error(`Brand with name ${brandData.name} already exists`);
      }
      const brand = await this.brand.create(brandData);
      return brand;
    } catch (error) {
      logger.error(`BrandsService.createBrand: ${error}`);
      throw error;
    }
  }

  async getBrand(id,limit,offset) {
    try {
      if (id) {
        const brand = await this.brand.findOne({ where: { id } });
        if (!brand) {
          logger.error(`BrandsService.getBrand: Brand with id ${id} not found`);
          throw new Error(Codes.STX0030);
        }
        return brand;
      }
      const brands = await this.brand.findAndCountAll({ limit, offset });
      // if (brands.count === 0 || !brands.rows.length) throw new Error(Codes.STX0029);
      return brands;
    } catch (error) {
      logger.error(`BrandsService.getBrand: ${error}`);
      throw error;
    }
  }

  async updateBrand(id, data) {
    try {
      const brand = await this.brand.findOne({ where: { id } });
      if (!brand) {
        logger.error(`BrandsService.updateBrand: Brand with id ${id} not found`);
        throw new Error(Codes.STX0030);
      }
      await this.brand.update(data, { where: { id } });
      return { oldName: brand?.name };
    } catch (error) {
      logger.error(`BrandsService.updateBrand: ${error}`);
      throw error;
    }
  }

  async deleteBrand(id) {
    try {
      const brand = await this.brand.findOne({ where: { id } });
      if (!brand) {
        logger.error(`BrandsService.deleteBrand: Brand with id ${id} not found`);
        throw new Error(Codes.STX0030);
      }
      await this.brand.destroy({ where: { id } });
      return { name: brand?.name };
    } catch (error) {
      logger.error(`BrandsService.deleteBrand: ${error}`);
      throw error;
    }
  }

}

export default BrandsService;
