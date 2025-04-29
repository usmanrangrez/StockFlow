import Joi from "joi";
import constants from "../config/constants.js";

export const brandsSchema = Joi.object({
  name: Joi.string().trim().required(),
  contactPerson: Joi.string().trim().optional().allow(null, ''),
  contactEmail: Joi.string().email().optional().allow(null, ''),
  contactPhone: Joi.string().length(10).pattern(constants.regex.phone).optional().allow(null, ''),
  website: Joi.string().uri().optional().allow(null, ''),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string().trim().optional().allow(null, ''),
  contactPerson: Joi.string().trim().optional().allow(null, ''),
  contactEmail: Joi.string().email().optional().allow(null, ''),
  contactPhone: Joi.string().length(10).pattern(constants.regex.phone).optional().allow(null, ''),
  website: Joi.string().uri().optional().allow(null, ''),
}).min(1);