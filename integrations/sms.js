import twilio from "twilio";
import { Logger } from "./winston.js";
import constants from "../config/constants.js";

const logger = new Logger("twilio.js");

export class Twil {
  constructor() {
    this.enabled = process.env.TWILIO_ENABLED == constants.boolean.true;
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.from = process.env.TWILIO_PHONE_NUMBER; 
  }

  async sendSMS(to, message) {
    try {
      if (!this.enabled) return;
      await this.client.messages.create({
        body: message,
        from: this.from,
        to
      });
      logger.info(`Twilio SMS sent to ${to}`);
    } catch (error) {
      logger.error(`Twil.sendSMS Error: ${error.message}`);
    }
  }
}
