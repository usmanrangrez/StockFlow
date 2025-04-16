export class DefaultController {
  healthCheck = async (req, res, next) => {
    try {
      const healthCheck = {
        status: "OK",
        message: "Server is running!",
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(healthCheck);
    } catch (error) {
      next(error);
    }
  };
}
