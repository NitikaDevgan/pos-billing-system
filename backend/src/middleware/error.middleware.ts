import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../shared/errors/AppError.js';

// Turns common database errors into client errors instead of generic 500s.
const prismaErrors: Record<string, [string, number]> = { P2002: ['A record with this name already exists', 409], P2003: ['Referenced record does not exist', 400], P2025: ['Record not found', 404], P2021: ['Database is not up to date. Stop the backend and run `npm run dev` again to apply migrations.', 503] };
function toAppError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && prismaErrors[error.code]) { const [message, status] = prismaErrors[error.code]; return new AppError(message, status); }
  return error;
}

export const errorMiddleware: ErrorRequestHandler = (rawError, _request, response, _next) => {
  const error = toAppError(rawError);
  const isExpected = error instanceof AppError;
  const statusCode = isExpected ? error.statusCode : 500;
  if (!isExpected) logger.error(error);
  response.status(statusCode).json({ success: false, message: isExpected ? error.message : 'Something went wrong', ...(isExpected && error.details ? { details: error.details } : {}), ...(env.NODE_ENV !== 'production' && !isExpected && error instanceof Error ? { stack: error.stack } : {}) });
};
