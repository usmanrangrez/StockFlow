import Joi from 'joi';
import constants from '../config/constants.js';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords must match' }),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).required(),
  role: Joi.string().valid(
    constants.db.roles.admin,
    constants.db.roles.manager,
    constants.db.roles.staff
  ).required(),
  active: Joi.boolean().required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
});

export const changePasswordSchema = Joi.object({
  username: Joi.string().min(3).required(),
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().invalid(Joi.ref('oldPassword')).min(8).required().messages({
    'any.invalid': 'New password must not be the same as old password',
    'string.min': 'New password must be at least 8 characters',
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Passwords must match' }),
});

export const resetPasswordSchema = Joi.object({
  username: Joi.string().min(3).required(),
});
