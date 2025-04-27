import Joi from "joi";
import constants from "../config/constants.js";

export const productSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string()
    .pattern(constants.regex.lettersCumNumbers)
    .trim()
    .required()
    .custom((value, helpers) => {
      if (value !== value.trim()) {
        return helpers.message(
          '"name" must not have leading or trailing spaces'
        );
      }
      if (value.includes(" ")) {
        return helpers.message('"name" must not contain spaces');
      }
      if (!constants.regex.lettersCumNumbers.test(value)) {
        return helpers.message('"name" must contain only letters and numbers');
      }
      return value;
    })
    .messages({
      "string.pattern.base": `"name" must contain only letters and numbers and should not contain spaces`,
      "string.trimmed": `"name" must not have leading or trailing spaces`,
    }),
  brandId: Joi.string().guid().required(),
});

export const bulkProductSchema = Joi.array().items(productSchema).min(1);

export const updateProductSchema = Joi.object({
  code: Joi.string().optional().allow(null, ""),
  name: Joi.string()
    .pattern(constants.regex.lettersCumNumbers)
    .trim()
    .custom((value, helpers) => {
      if (value !== value.trim()) {
        return helpers.message(
          '"name" must not have leading or trailing spaces'
        );
      }
      if (value.includes(" ")) {
        return helpers.message('"name" must not contain spaces');
      }
      if (!constants.regex.lettersCumNumbers.test(value)) {
        return helpers.message('"name" must contain only letters and numbers');
      }
      return value;
    })
    .optional()
    .allow(null, ""),
  brandId: Joi.string().strict().optional().allow(null, ""),
});
