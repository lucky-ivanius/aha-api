import { PrismaUsersRepository } from '../../persistence/repositories/prisma-users.repository';
import { prismaClient } from './prisma-client';

export const usersRepository = new PrismaUsersRepository(prismaClient);
