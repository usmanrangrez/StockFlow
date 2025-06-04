import Joi from "joi";

export const salesSchema  = Joi.array().items(Joi.object({
    customerId: Joi.string().uuid().required(),
    productId: Joi.string().uuid().required(),
    colorId: Joi.string().uuid().required(),
    mrp: Joi.number().integer().min(0).required(),
    sizeRangeId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required(),
    discountPercentage: Joi.number().integer().min(0).required(),
})).min(1).message('You must sell at least one product').max(20).message('You can sell only 20 products at a time and that too for the same customer');

export const updateSaleSchema = Joi.object({
    quantity: Joi.number().integer().min(1).positive().optional(),
    discountPercentage: Joi.number().integer().min(0).optional()
}).min(1);


