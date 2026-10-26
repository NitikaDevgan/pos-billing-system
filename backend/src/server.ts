import app from './app.js';
import { runFirstTimeSetup } from './bootstrap/firstRun.js';
import { prisma } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
// A setup failure (e.g. migrations not applied) shouldn't stop the menu API from serving.
await runFirstTimeSetup().catch((error) => { logger.error(error); logger.warn('First-time setup failed. Run `npx prisma migrate deploy` and restart.'); });
if (!process.env.JWT_SECRET) logger.warn('JWT_SECRET not set — using an insecure development secret.');
const server = app.listen(env.PORT, () => logger.info(`Backend listening on http://localhost:${env.PORT}`));
async function shutdown(signal: string) { logger.info(`${signal} received. Shutting down gracefully.`); server.close(async () => { await prisma.$disconnect(); process.exit(0); }); }
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
