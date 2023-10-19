import { PrismaClient } from '@prisma/client';
import { differenceInDays, endOfDay, startOfDay } from 'date-fns';
import { Id } from '../../../../domain/common/id';
import { Session } from '../../../../domain/models/session/session';
import { SessionsRepository } from '../../../../domain/repositories/sessions.repository';

export class PrismaSessionsRepository implements SessionsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async avgSessionByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const sessionCount = await this.prisma.session.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: startOfDay(startDate),
            },
          },
          {
            createdAt: {
              lte: endOfDay(endDate),
            },
          },
        ],
      },
    });

    const dateRangeNumber = differenceInDays(endDate, startDate);

    return Math.ceil(sessionCount / dateRangeNumber);
  }

  async countSessionByDate(date: Date): Promise<number> {
    const sessionCount = await this.prisma.session.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: startOfDay(date),
            },
          },
          {
            createdAt: {
              lte: endOfDay(date),
            },
          },
        ],
      },
    });

    return sessionCount;
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        token,
      },
    });

    if (!session) return null;

    return Session.create(
      {
        userId: new Id(session.userId),
        expiryDate: session.expiryDate,
        token: session.token,
      },
      new Id(session.id)
    ).data;
  }

  async save(session: Session): Promise<void> {
    const id = session.id.toString();

    await this.prisma.session.upsert({
      where: {
        id,
      },
      create: {
        userId: session.userId.toString(),
        token: session.token,
        expiryDate: session.expiryDate,
      },
      update: {
        userId: session.userId.toString(),
        token: session.token,
        expiryDate: session.expiryDate,
      },
    });
  }
}
