import AppError from "../utills/appError";
import { Response } from "express";
import { ErrorRequestHandler } from "express";
import { z } from "zod";
import { BAD_REQUEST } from '../constants/httpStatusCode';


const handleZodError = (res: Response, err: z.ZodError) => {
  const errors = err.errors.map((error) => {
    return {
      path: error.path.join("."),
      message: error.message,
    }
  });

  return res.status(BAD_REQUEST).json({
    message: err.message,
    errors,
  });
};

class ErrorHandler {
  public errorHandler: ErrorRequestHandler = (
    err, req, res, next
  ) => {
    console.log(`PATH: ${req.path} - ${req.method}`, err);

    // const invalidUrl = _req.url.endsWith('/');
    const status = err instanceof AppError ? err.statusCode : 500;

    if (err instanceof z.ZodError) {
      handleZodError(res, err);
      return;
    }

    res.status(status).json({
      message: err.message || 'Internal Server Error',
      status,
      success: false
    });

    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
    next();
  }
};

export default ErrorHandler;