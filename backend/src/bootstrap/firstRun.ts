import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

// The original counter menu. Inserted by name only when missing, so admin edits are never overwritten.
export const starterMenu: Record<string, { name: string; price: number; isActive?: boolean }[]> = {
  Tea: [
    { name: 'Masala Tea', price: 30 },
    { name: 'Ginger Tea', price: 35 },
    { name: 'Elaichi Tea', price: 35 },
    { name: 'Lemon Tea', price: 30 },
    { name: 'Green Tea', price: 40, isActive: false },
  ],
  Snacks: [{ name: 'Bun Maska', price: 50 }],
  Sandwiches: [
    { name: 'Veg Sandwich', price: 80 },
    { name: 'Cheese Sandwich', price: 100 },
  ],
  Fries: [
    { name: 'French Fries', price: 70 },
    { name: 'Peri Peri Fries', price: 80 },
  ],
  Drinks: [
    { name: 'Cold Coffee', price: 90 },
    { name: 'Lemonade', price: 50 },
  ],
};

export async function addMissingStarterMenu() {
  for (const [categoryName, products] of Object.entries(starterMenu)) {
    const category = await prisma.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } });
    for (const product of products) {
      const exists = await prisma.product.findFirst({ where: { name: product.name } });
      if (!exists) await prisma.product.create({ data: { ...product, categoryId: category.id } });
    }
  }
}

/** Creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD, or resets its password if it already exists. */
export async function upsertAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin account created.');
    return false;
  }
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { passwordHash, role: 'ADMIN', isActive: true },
    create: { name: env.ADMIN_NAME, email: env.ADMIN_EMAIL, passwordHash, role: 'ADMIN' },
  });
  return true;
}

/**
 * Runs on server start. Only does work the very first time (no admin exists yet):
 * creates the admin account and fills in the starter menu.
 */
export async function runFirstTimeSetup() {
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  if (adminCount > 0) return;
  if (!(await upsertAdmin())) return;
  await addMissingStarterMenu();
  logger.info(`First-time setup done. Admin login: ${env.ADMIN_EMAIL}`);
}
