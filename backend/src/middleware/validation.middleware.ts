import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../shared/errors/AppError.js';
export function validateRequest(schema: ZodType): RequestHandler { return (request, _response, next) => { const result = schema.safeParse({ body: request.body, params: request.params, query: request.query }); if (!result.success) return next(new AppError('Request validation failed', 400, result.error.flatten())); return next(); }; }
