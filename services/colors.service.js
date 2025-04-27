import { Codes } from "../config/codes.js";
import { Logger } from "../integrations/winston.js";
import Colors from "../models/colors.model.js";

const logger = new Logger();

class ColorsService {
  constructor() {
    this.color = Colors;
  }

  async createColor(color) {
    try {
      const existingColor = await this.color.findOne({ where: { name: color.name.trim() } });
      if (existingColor) throw new Error(`Color with name ${color.name} already exists`);

      const createdColor = await this.color.create(color);
      return createdColor;
    } catch (error) {
      logger.error(`ColorsService.createdColor: ${error}`);
      throw error;
    }
  }

  async updateColor(id, color) {
    try {
      const existingColor = await this.color.findOne({ where: { id } });
      if (!existingColor) throw new Error(`Color with id ${id} does not exist`);

      await this.color.update(color, { where: { id } });
      return { name: existingColor.name.trim() };
    } catch (error) {
      logger.error(`ColorsService.updateColor: ${error}`);
      throw error;
    }
  }

  async deleteColor(id) {
    try {
      const existingColor = await this.color.findOne({ where: { id } });
      if (!existingColor) throw new Error(`Color with id ${id} does not exist`);

      await this.color.destroy({ where: { id } });
      return { name: existingColor?.name.trim() };
    } catch (error) {
      logger.error(`ColorsService.deleteColor: ${error}`);
      throw error;
    }
  }

  async getColors(id) {
    try {
      if (id) {
        const color = await this.color.findOne({ where: { id } });
        if (!color) {
          logger.error(`ColorsService.getProducts: Color with id ${id} not found`);
          throw new Error(Codes.STX0044);
        }
        return color;
      }
      const colors = await this.color.findAndCountAll();
      if (colors.count === 0 || !colors.rows.length) throw new Error(Codes.STX0045);
      return colors;
    } catch (error) {
      logger.error(`ColorsService.getProducts: ${error.message}`);
      throw error;
    }
  }

}

export default ColorsService;
