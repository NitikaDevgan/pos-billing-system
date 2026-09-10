import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../shared/errors/AppError.js';
export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  const isExpected = error instanceof AppError;
  const statusCode = isExpected ? error.statusCode : 500;
  if (!isExpected) logger.error(error);
  response.status(statusCode).json({ success: false, message: isExpected ? error.message : 'Something went wrong', ...(isExpected && error.details ? { details: error.details } : {}), ...(env.NODE_ENV !== 'production' && !isExpected ? { stack: error.stack } : {}) });
};
