import Joi from "joi";

export const createVariant = Joi.object({
  productId: Joi.string().uuid().required(),
  colorId: Joi.string().uuid().required(),
  sizeRangeId: Joi.string().uuid().required(),
  mrp: Joi.number().required(),
});

export const updateVariant = Joi.object({
  mrp: Joi.number().optional(),
  colorId: Joi.string().uuid().optional(),
  sizeRangeId: Joi.string().uuid().optional(),
}).min(1);
