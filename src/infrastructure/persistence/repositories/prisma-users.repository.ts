import { Prisma, PrismaClient } from '@prisma/client';
import { Id } from '../../../domain/common/id';
import { Email } from '../../../domain/models/user/email';
import { IdentityProvider } from '../../../domain/models/user/identity-provider';
import { Name } from '../../../domain/models/user/name';
import { Password } from '../../../domain/models/user/password';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';

type PrismaUser = Prisma.UserGetPayload<{
  include: {
    provider: true;
    sessions: true;
  };
}>;

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapUser(user: PrismaUser): User {
    return User.create(
      {
        name: Name.create(user.name).data,
        email: Email.create(user.email).data,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        ...(user.password && {
          password: Password.create(user.password, true).data,
        }),
        ...(user.provider && {
          provider: IdentityProvider.create(
            user.provider.provider,
            user.provider.identifier
          ).data,
        }),
        ...(user.lastLogin && {
          lastLogin: user.lastLogin,
        }),
        ...(user.sessions.length > 0 && {
          lastSession: user.sessions.at(0)?.createdAt,
        }),
      },
      new Id(user.id)
    ).data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      include: {
        provider: true,
        sessions: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      where: {
        email,
      },
    });

    if (!user) return null;

    const userResult = this.mapUser(user);

    return userResult;
  }

  async findById(id: Id): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      include: {
        provider: true,
        sessions: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      where: {
        id: id.toString(),
      },
    });

    if (!user) return null;

    const userResult = this.mapUser(user);

    return userResult;
  }

  async findByProvider(
    provider: string,
    identifier: string
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      include: {
        provider: true,
        sessions: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      where: {
        provider: {
          provider,
          identifier,
        },
      },
    });

    if (!user) return null;

    const userResult = this.mapUser(user);

    return userResult;
  }

  async getUserList(page: number, pageSize: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        provider: true,
        sessions: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return users.map(this.mapUser);
  }

  async isUserVerified(userId: Id): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId.toString(),
        isEmailVerified: true,
      },
    });

    return !!user;
  }

  async count(): Promise<number> {
    const usersCount = await this.prisma.user.count();

    return usersCount;
  }

  async save(user: User): Promise<void> {
    const id = user.id.toString();

    const upsertData = {
      id,
      name: user.name.value,
      email: user.email.value,
      isEmailVerified: user.isEmailVerified,
      loginCount: user.loginCount,
      ...(user.lastLogin && { lastLogin: user.lastLogin }),
      ...(user.password && { password: user.password.value }),
      ...(user.provider && {
        provider: {
          connectOrCreate: {
            create: {
              provider: user.provider.provider,
              identifier: user.provider.identifier,
            },
            where: {
              userId: id,
            },
          },
        },
      }),
    };

    await this.prisma.user.upsert({
      where: {
        id,
      },
      create: upsertData,
      update: upsertData,
    });
  }
}
