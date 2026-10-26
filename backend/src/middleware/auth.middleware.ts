import type { Role } from '@prisma/client';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../shared/errors/AppError.js';

export type AuthUser = { id: string; role: Role };

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

/** Verifies the `Authorization: Bearer <token>` header and attaches `request.user`. */
export const authenticate: RequestHandler = (request, _response, next) => {
  const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) return next(new AppError('Authentication required', 401));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & { role: Role };
    request.user = { id: payload.sub as string, role: payload.role };
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

/** Must run after `authenticate`. Rejects users whose role is not in the allowed list. */
export function requireRole(...roles: Role[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.user) return next(new AppError('Authentication required', 401));
    if (!roles.includes(request.user.role)) return next(new AppError('You do not have permission to perform this action', 403));
    return next();
  };
}

export const adminOnly = [authenticate, requireRole('ADMIN')];
