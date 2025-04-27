import Joi from "joi";

export const sizesSchema = Joi.object({
  sizeRange: Joi.array().items(Joi.number()).required()
});

export const updateSizeSchema = Joi.object({
  id: Joi.string().required(),
  sizeRange: Joi.array().items(Joi.number()).required()
});
