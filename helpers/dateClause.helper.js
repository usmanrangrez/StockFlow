import { Op } from "sequelize";
import { Logger } from "../integrations/winston.js";
const logger = new Logger();
export const buildDateClause = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    if (!isNaN(start) && !isNaN(end)) {
      return { [Op.between]: [start, end] };
    }

    return undefined;
  } catch (error) {
    logger.error(`Error in buildDateClause: ${error}`);
    return undefined;
  }
};
