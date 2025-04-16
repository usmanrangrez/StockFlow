import { Sequelize } from "sequelize";
import { Logger } from "../integrations/winston.js";
import constants from "../config/constants.js";

const logger = new Logger("database.js");

export class Database {
  static instance;

  constructor({ enableConnectionHooks = false } = {}) {
    if (Database.instance) {
      return Database.instance;
    }

    this.sequelize = new Sequelize({
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
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
                rejectUnauthorized: false, //using supabase which has self hosted certs (so keep false)
              },
            }
          : {},
    });
    if (enableConnectionHooks == constants.boolean.true) {
      this.setupConnectionHooks(); //test only once trail purpose
    }
    // this.testConnection(); //turning on will test connection twice one from here and other from server.js
    Database.instance = this;
  }

  setupConnectionHooks() {
    this.sequelize.beforeConnect(async (config) => {
      logger.info(
        `[HOOK - beforeConnect] Preparing to connect to DB at ${config.host}:${config.port} as user "${config.username}"`
      );
    });

    this.sequelize.afterConnect(async (connection, config) => {
      logger.info(
        `[HOOK - afterConnect] Successfully connected to DB at ${config.host}:${config.port} as user "${config.username}"`
      );
    });

    this.sequelize.beforeDisconnect(async (connection) => {
      logger.info(
        "[HOOK - beforeDisconnect] Preparing to disconnect from the database..."
      );
    });

    this.sequelize.afterDisconnect(async (connection) => {
      logger.info(
        "[HOOK - afterDisconnect] Successfully disconnected from the database."
      );
    });
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      logger.info("Database connection established successfully.");
    } catch (error) {
      logger.error(`Unable to connect to the database:${error}`);
    }
  }

  getSequelize() {
    return this.sequelize;
  }
}
