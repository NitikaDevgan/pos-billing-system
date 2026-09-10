import app from './app.js';
import { prisma } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
const server = app.listen(env.PORT, () => logger.info(`Backend listening on http://localhost:${env.PORT}`));
async function shutdown(signal: string) { logger.info(`${signal} received. Shutting down gracefully.`); server.close(async () => { await prisma.$disconnect(); process.exit(0); }); }
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
