import Joi from "joi";
import constants from "../config/constants.js";

export const customersSchema = Joi.object({
    name: Joi.string().trim().required(),
    phone: Joi.string().length(10).pattern(constants.regex.phone).required(),
    email: Joi.string().email().optional(),
    address: Joi.string().trim().required(),
    district: Joi.string().valid(
        constants.db.districts.ANANTNAG,
        constants.db.districts.BARAMULLA,
        constants.db.districts.BANDIPORA,
        constants.db.districts.BUDGAM,
        constants.db.districts.GANDERBAL,
        constants.db.districts.KUPWARA,
        constants.db.districts.KULGAM,
        constants.db.districts.PULWAMA,
        constants.db.districts.SHOPIAN,
        constants.db.districts.SRINAGAR
    ).required()
});

export const updateCustomerSchema = Joi.object({
    name: Joi.string().trim().optional(),
    phone: Joi.string().length(10).pattern(constants.regex.phone).optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().trim().optional(),
    district: Joi.string().valid(
        constants.db.districts.ANANTNAG,
        constants.db.districts.BARAMULLA,
        constants.db.districts.BANDIPORA,
        constants.db.districts.BUDGAM,
        constants.db.districts.GANDERBAL,
        constants.db.districts.KUPWARA,
        constants.db.districts.KULGAM,
        constants.db.districts.PULWAMA,
        constants.db.districts.SHOPIAN,
        constants.db.districts.SRINAGAR
    ).optional(),
}).min(1);



