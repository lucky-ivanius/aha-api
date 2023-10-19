import { PrismaClient } from '@prisma/client';
import { PrismaSessionsRepository } from './implementations/prisma-sessions.repository';
import { PrismaUsersRepository } from './implementations/prisma-users.repository';

const prismaClient = new PrismaClient();

export const prismaUsersRepository = new PrismaUsersRepository(prismaClient);
export const prismaSessionsRepository = new PrismaSessionsRepository(
  prismaClient
);
