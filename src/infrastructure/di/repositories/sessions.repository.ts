import { PrismaSessionsRepository } from '../../persistence/repositories/prisma-sessions.repository';
import { prismaClient } from './prisma-client';

export const sessionsRepository = new PrismaSessionsRepository(prismaClient);
