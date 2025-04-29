import Joi from "joi";
import constants from "../config/constants.js";

export const cartonsSchema = Joi.object({
  variantId: Joi.string().uuid().required(),
  location: Joi.string().valid(
    constants.db.locations.groundFloor,
    constants.db.locations.firstFloor,
    constants.db.locations.secondFloor,
    constants.db.locations.shed
  ),
  quantity: Joi.number().integer().min(1).required(),
  pairsPerCarton: Joi.number().integer().min(1).required(),
});

export const updateCartonSchema = Joi.object({
  quantity: Joi.number().integer().min(0),
  location: Joi.string().valid(
    constants.db.locations.groundFloor,
    constants.db.locations.firstFloor,
    constants.db.locations.secondFloor,
    constants.db.locations.shed
  ),
}).min(1);

