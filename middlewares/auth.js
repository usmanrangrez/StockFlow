import jwt from "jsonwebtoken";
import { Codes } from "../config/codes.js";
import constants from "../config/constants.js";
import { Logger } from "../integrations/winston.js";
import { nodeCache } from '../integrations/nodeCache.js';
import { Cache } from "../integrations/redis.js";
import { ForbiddenError, UnauthorizedError } from "../utils/error.js";

const redisCache = new Cache();
const logger = new Logger("authmiddleware.js");

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error(Codes.STX0006);

        const token = req.headers.authorization.split(' ').pop()
        if (!token) throw new Error(Codes.STX0006);
        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) throw UnauthorizedError(Codes.STX0012);

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error(`AuthService.verifyToken: ${error.message}`);
        next(error)
    }
}

export const verifyRole = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            const userRole = user.role;
            if (!allowedRoles.includes(userRole)) throw ForbiddenError(Codes.STX0017);
            next();
        } catch (error) {
            logger.error(`AuthService.verifyRole: ${error.message}`);
            next(error);
        }
    };
};



export const isTokenBlacklisted = async (token) => {
    if (process.env.REDIS_CONNECTION === "true" || process.env.REDIS_CONNECTION === constants.boolean.true) {
        const value = await redisCache.get(token);
        return Boolean(value);
    } else {
        const hasToken = nodeCache.has(token);
        return hasToken;
    }
}

export const generateToken = async (payload, secret, expiresIn) => {
    try {
        return jwt.sign(payload, secret, { expiresIn });
    } catch (error) {
        logger.error(`AuthService.generateToken: ${error.message}`);
        throw new Error(Codes.STX0014);
    }
}

