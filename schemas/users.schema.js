import Joi from 'joi';
import constants from '../config/constants.js';

export const updateUserSchema = Joi.object({
    phone: Joi.string().length(10).allow(null, '').optional(),
    role: Joi.string()
        .valid(
            constants.db.roles.admin,
            constants.db.roles.manager,
            constants.db.roles.staff
        )
        .allow(null, '').optional(),
    active: Joi.boolean().allow(null, '').optional(),
});