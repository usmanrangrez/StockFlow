import { BadRequestError } from "../utils/error.js";

export const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const message = error.details[0]?.message || "Invalid request";
      return next(BadRequestError(message));
    }
    next();
  };
};
