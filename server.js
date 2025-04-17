import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "./integrations/winston.js";
import router from "./routes/index.route.js";
import morganMiddleware from "./middlewares/morgan.js";
import errorHanlder from "./middlewares/error.js";
import { Database } from "./integrations/database.js";
import rateLimitter from "./integrations/rateLimiter.js";

const logger = new Logger();
new Database();
const db = Database.getSequelize();


class AppServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = null;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
    this.startServer();
    this.handleGracefulShutdown();
    this.connectDB();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morganMiddleware);
    this.app.use(rateLimitter);
  }

  setupRoutes() {
    this.app.use("/api/v1", router);
  }

  startServer() {
    try {
      this.server = this.app.listen(this.port, () => {
        logger.info(`Server is running on port ${this.port}`);
      });

      this.server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          logger.error(`Port ${this.port} is already in use. Maybe another instance is running?`);
        } else {
          logger.error(`Server error:${err}`);
        }
        process.exit(1);
      });
    } catch (error) {
      logger.error(`Error starting server: ${error}`);
    }
  }

  setupErrorHandler() {
    this.app.use(errorHanlder);
  }

  async connectDB() {
    try {
      await db.authenticate();
      logger.info("Database connection established successfully.");
    } catch (error) {
      logger.error(`Database connection error:${error}`);
      process.exit(1);
    }
  }

  handleGracefulShutdown() {
    const shutdown = () => {
      logger.info("Graceful shutdown initiated...");
      if (this.server) {
        this.server.close(() => {
          logger.info("Server closed successfully.");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }
}

try {
  new AppServer();
} catch (error) {
  logger.error(`AppServer initialization failed:${error}`);
}
