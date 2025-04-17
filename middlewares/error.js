import { Logger } from "../integrations/winston.js";
const errorLogger = new Logger("error.js");

const errorHanlder = (err, req, res, next) => {
  errorLogger.error(err.message);
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV == "development" ? err.stack : {},
  });
};

export default errorHanlder;
