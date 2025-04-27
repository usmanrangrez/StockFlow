import { Codes } from "../config/codes.js";
import { Logger } from "../integrations/winston.js";
import Sizes from "../models/sizes.model.js";

const logger = new Logger();

class SizesService {
  constructor() {
    this.sizes = Sizes;
  }

  async createSize(body) {
    try {
      const descendingSize = body.sizeRange.map(Number).sort((a, b) => a - b);
      const existingSize = await this.sizes.findOne({ where: { sizeRange: descendingSize } });
      if (existingSize) throw new Error(`Size with range ${body.sizeRange} already exists or a similar one is already registered`);

      const createdSize = await this.sizes.create({ sizeRange: descendingSize });
      return createdSize;
    } catch (error) {
      logger.error(`SizesService.createSize: ${error}`);
      throw error;
    }
  }

  async updateSize(id,body) {
    try {
      const size = await this.sizes.findOne({ where: { id } });
      if (!size) throw new Error(`Size with id ${id} not found`);

      const descendingSize = body.sizeRange.map(Number).sort((a, b) => a - b);
      const existingSize = await this.sizes.findOne({ where: { sizeRange: descendingSize } });
      if (existingSize) throw new Error(`Size with range ${body.sizeRange} already exists or a similar one is already registered`);

      await this.sizes.update({ sizeRange: descendingSize }, { where: { id: id } });
      return { size: descendingSize };
    } catch (error) {
      logger.error(`SizesService.updateSize: ${error}`);
      throw error;
    }
  } 

  async getAllSizes(body) {
    try {
      if(body?.ids) {
        const ids = body.ids?.map((item) => item);
        const sizes = await this.sizes.findAll({ where: { id: ids } });
        if (!sizes.length) throw new Error(Codes.STX0050);
        return sizes;
      }
      const sizes = await this.sizes.findAll();
      if (!sizes.length) throw new Error(Codes.STX0049);
      return sizes;
    } catch (error) {
      logger.error(`SizesService.getAllSizes: ${error}`);
      throw error;
    }
  } 

  async deleteSize(id) {
    try {
      const size = await this.sizes.findOne({ where: { id } });
      if (!size) throw new Error(Codes.STX0052);

      await this.sizes.destroy({ where: { id } });
      return { message: Codes.STX0051 };
    } catch (error) {
      logger.error(`SizesService.deleteSize: ${error}`);
      throw error;
    }
  }

}

export default SizesService;
