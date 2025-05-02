import Joi from "joi";

export const billsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        customerId: Joi.string().uuid().required(),
        productId: Joi.string().uuid().required(),
        colorId: Joi.string().uuid().required(),
        sizeRangeId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        discountPercentage: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .max(20)
    .required()
    .messages({
      'array.min': 'You must bill at least one product',
      'array.max': 'You can bill only 20 products at a time',
      'any.required': 'Items array is required',
    }),
  paymentMethod: Joi.string()
    .valid('Cash', 'UPI', 'Cheque', 'Others', "*")
    .default('Cash')
    .required(),
  referenceNo: Joi.string().optional().allow(''),
  note: Joi.string().optional().allow(''),
  prefferedUiMode: Joi.string().valid('download', 'show', "").optional().allow('',null),
});

export const generateBillForSaleSchema = Joi.object({
  saleIds: Joi.array().items(Joi.string().uuid()).min(1).required()
});



