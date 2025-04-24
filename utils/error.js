export const handleAppError = (message, statusCode = 500) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
  };
  
  export const ForbiddenError = (msg = "Forbidden") => handleAppError(msg, 403);
  export const UnauthorizedError = (msg = "Unauthorized") => handleAppError(msg, 401);
  export const BadRequestError = (msg = "Bad Request") => handleAppError(msg, 422);
  