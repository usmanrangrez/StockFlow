import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "./integrations/winston.js";
import router from "./routes/index.js";
import morganMiddleware from "./middlewares/morgan.js";
import errorHanlder from "./middlewares/error.js";

const logger = new Logger();

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
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morganMiddleware);
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
          logger.error(
            `Port ${this.port} is already in use. Maybe another instance is running?`
          );
        } else {
          logger.error("Server error:", err);
        }
        process.exit(1);
      });
    } catch (error) {
      logger.error("Error starting server:", error);
    }
  }

  setupErrorHandler() {
    this.app.use(errorHanlder);
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
  logger.error("AppServer initialization failed:", error);
}
