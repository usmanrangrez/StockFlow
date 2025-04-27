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

  async updateColor(name, color) {
    try {
      const existingColor = await this.color.findOne({ where: { name: name.trim() } });
      if (!existingColor) throw new Error(`Color with name ${name} does not exist`);

      await this.color.update(color, { where: { name: name.trim() } });
      return { name: name.trim() };
    } catch (error) {
      logger.error(`ColorsService.updateColor: ${error}`);
      throw error;
    }
  }

  async deleteColor(name) {
    try {
      const existingColor = await this.color.findOne({ where: { name: name.trim() } });
      if (!existingColor) throw new Error(`Color with name ${name} does not exist`);

      await this.color.destroy({ where: { name: name.trim() } });
      return { name: name.trim() };
    } catch (error) {
      logger.error(`ColorsService.deleteColor: ${error}`);
      throw error;
    }
  }

  async getColors(colorName) {
    try {
      if (colorName) {
        const color = await this.color.findOne({ where: { name: colorName } });
        if (!color) {
          logger.error(`ColorsService.getProducts: Color with name ${color} not found`);
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
