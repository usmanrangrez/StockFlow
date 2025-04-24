import { Codes } from "../config/codes.js";
import { BadRequestError } from "../utils/error.js";

export const validateSchema = (schema) => {
  return (req, res, next) => {
    if (!schema) return next(BadRequestError(Codes.STX0021));
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const message = error.details[0]?.message || "Invalid request";
      return next(BadRequestError(message));
    }
    next();
  };
};
