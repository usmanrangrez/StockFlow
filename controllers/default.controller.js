import { Database } from "../integrations/database.js";
import { Logger } from "../integrations/winston.js";

const logger = new Logger("healthcheck");

export class DefaultController {
  healthCheck = async (req, res, next) => {
    try {
      // Health check object
      const healthCheck = {
        status: "OK",
        message: "Server is running!",
        timestamp: new Date().toISOString(),
      };

      // Check DB health
      const dbStatus = await this.checkDbHealth();
      if (dbStatus !== "OK") {
        healthCheck.status = "ERROR";
        healthCheck.message = "Database connection issue";
        healthCheck.dbStatus = dbStatus;
        return res.status(500).json(healthCheck);
      }

      // Check Logger health
      const loggerStatus = this.checkLoggerHealth();
      if (!loggerStatus) {
        healthCheck.status = "ERROR";
        healthCheck.message = "Logger issue detected";
        return res.status(500).json(healthCheck);
      }

      res.status(200).json(healthCheck);
    } catch (error) {
      next(error);
    }
  };

  // Database health check
  checkDbHealth = async () => {
    try {
      const db = Database.getSequelize();
      await db.authenticate();
      return "OK";
    } catch (error) {
      logger.error(`Database connection error ${error.message}`);
      return "ERROR";
    }
  };

  checkLoggerHealth = () => {
    try {
      logger.info("Logger health check");
      return true;
    } catch (error) {
      logger.error(`Logger is not working properly error ${error.message}`);
      return false;
    }
  };
}
