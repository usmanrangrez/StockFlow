import winston from "winston";
import constants from "../config/constants.js";
import { Logtail } from '@logtail/node';  
import { LogtailTransport } from "@logtail/winston"; 

const { combine, timestamp, json, colorize, simple, label } = winston.format;

export class Logger {
  static instance;

  constructor(sourceFile = "Unknown") {
    if (Logger.instance) {
      return Logger.instance;
    }

    const logtailClient = new Logtail(process.env.LOG_TAIL_TOKEN, {
      endpoint: process.env.INGESTING_HOST
    });

    this.logger = winston.createLogger({
      level: "info",
      format: combine(
        label({ label: sourceFile }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
        json()
      ),
      transports: [
        new winston.transports.File({ filename: "logs.log", level: "info" }),
        // Uncomment to enable Logtail logging for remote service
        // new LogtailTransport(logtailClient),
      ],
    });

    if (process.env.NODE_ENV !== constants.env.prod) {
      this.logger.add(
        new winston.transports.Console({
          format: combine(
            colorize(),
            label({ label: sourceFile }),  // Show source file in console log
            timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
            simple()
          ),
        })
      );
    }

    Logger.instance = this;
  }

  log(level, message) {
    this.logger.log({ level, message });
  }

  info(message) {
    this.logger.info(message);
  }

  error(message) {
    this.logger.error(message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  debug(message) {
    this.logger.debug(message);
  }

  silly(message) {
    this.logger.silly(message);
  }
}
