import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../shared/errors/AppError.js';
// Replaces request.body with the parsed value so handlers get trimmed/coerced data.
export function validateRequest(schema: ZodType<{ body?: unknown }>): RequestHandler { return (request, _response, next) => { const result = schema.safeParse({ body: request.body, params: request.params, query: request.query }); if (!result.success) return next(new AppError('Request validation failed', 400, result.error.flatten())); if (result.data.body !== undefined) request.body = result.data.body; return next(); }; }
