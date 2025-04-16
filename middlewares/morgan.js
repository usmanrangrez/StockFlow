import morgan from "morgan";
import { Logger } from "../integrations/winston.js";

const accessLogger = new Logger("morgan.js");

const morganStream = {
  write: (message) => {
    accessLogger.info(message.trim());
  },
};

const morganMiddleware = morgan("combined", { stream: morganStream });

export default morganMiddleware;
