import { Logger } from "./winston.js";
import axios from "axios";

const logger = new Logger("request.js");

export class Request {
  static async get(url, config = {}) {
    try {
      const response = await axios.get(url, config);
      logger.info(`GET ${url} - Status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error(`GET ${url} failed: ${error.message}`);
      throw error;
    }
  }

  static async post(url, data = {}, config = {}) {
    try {
      const response = await axios.post(url, data, config);
      logger.info(`POST ${url} - Status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error(`POST ${url} failed: ${error.message}`);
      throw error;
    }
  }
}
