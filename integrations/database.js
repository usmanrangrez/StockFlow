import { Sequelize } from "sequelize";
import { Logger } from "../integrations/winston.js";
import constants from "../config/constants.js";

const logger = new Logger("database.js");

export class Database {
  static instance;
  static sequelize;
  
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    Database.sequelize = new Sequelize({
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: (msg) => logger.info(msg),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions:
        process.env.DB_SSL === constants.boolean.true
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    });
    
    const enableHooks = process.env.ENABLE_CONNECTION_HOOKS
                       
    if (enableHooks) {
      this.setupConnectionHooks();
    }
    
    Database.instance = this;
  }
  
  static getSequelize() {
    if (!Database.sequelize) {
      new Database();
    }
    return Database.sequelize;
  }
  
  setupConnectionHooks() {
    Database.sequelize.beforeConnect(async (config) => {
      logger.info(
        `[HOOK - beforeConnect] Preparing to connect to DB at ${config.host}:${config.port} as user "${config.username}"`
      );
    });
    
    Database.sequelize.afterConnect(async (connection, config) => {
      logger.info(
        `[HOOK - afterConnect] Successfully connected to DB at ${config.host}:${config.port} as user "${config.username}"`
      );
    });
    
    Database.sequelize.beforeDisconnect(async (connection) => {
      logger.info(
        "[HOOK - beforeDisconnect] Preparing to disconnect from the database..."
      );
    });
    
    Database.sequelize.afterDisconnect(async (connection) => {
      logger.info(
        "[HOOK - afterDisconnect] Successfully disconnected from the database."
      );
    });
  }
  
  async testConnection() {
    try {
      await Database.sequelize.authenticate();
      logger.info("Database connection established successfully.");
    } catch (error) {
      logger.error(`Unable to connect to the database:${error}`);
    }
  }
}