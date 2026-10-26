import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { AppError } from '../../shared/errors/AppError.js';
import type { LoginInput } from './auth.validator.js';

const toPublicUser = ({ id, name, email, role }: User) => ({ id, name, email, role });

export const authService = {
  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Same message for unknown email and wrong password so accounts can't be enumerated.
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Invalid email or password', 401);
    const token = jwt.sign({ role: user.role }, env.JWT_SECRET, { subject: user.id, expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] });
    return { token, user: toPublicUser(user) };
  },
  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw new AppError('Authentication required', 401);
    return toPublicUser(user);
  },
};
