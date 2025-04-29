import Joi from "joi";
import constants from "../config/constants.js";

export const colorsSchema = Joi.object({
  name: Joi.string().trim().required(),
});

export const updateColorSchema = Joi.object({
  name: Joi.string().trim().optional().required(null, ''),
}).min(1);