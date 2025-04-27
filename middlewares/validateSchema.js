import { Codes } from "../config/codes.js";
import { Logger } from "../integrations/winston.js";
import { BadRequestError } from "../utils/error.js";
const logger = new Logger();

export const validateSchema = (schema) => {
  return (req, res, next) => {
    if (!schema) return next(BadRequestError(Codes.STX0021));

    // Initialize req.body as empty object if it's undefined since Joi doesn't handle undefined
    if (!req.body) req.body = {};

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      logger.error(`validateSchema: ${error.details[0]?.message}`);
      const message = error.details[0]?.message || "Invalid request";
      return next(BadRequestError(message));
    }
    next();
  };
};
