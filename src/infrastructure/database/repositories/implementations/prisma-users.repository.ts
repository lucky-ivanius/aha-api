import { PrismaClient } from '@prisma/client';
import { Id } from '../../../../domain/common/id';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User } from '../../../../domain/models/user/user';
import { UsersRepository } from '../../../../domain/repositories/users.repository';

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      include: {
        identityProvider: true,
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

    const userResult = User.create(
      {
        name: Name.create(user.name).data,
        email: Email.create(user.email).data,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        ...(user.password && {
          password: Password.create(user.password, true).data,
        }),
        ...(user.identityProvider && {
          identityProvider: IdentityProvider.create(
            user.identityProvider.provider,
            user.identityProvider.identifier
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
    );

    return userResult.data;
  }

  async findById(id: Id): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      include: {
        identityProvider: true,
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

    const userResult = User.create(
      {
        name: Name.create(user.name).data,
        email: Email.create(user.email).data,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        ...(user.password && {
          password: Password.create(user.password, true).data,
        }),
        ...(user.identityProvider && {
          identityProvider: IdentityProvider.create(
            user.identityProvider.provider,
            user.identityProvider.identifier
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
    );

    return userResult.data;
  }

  async getUserList(page: number, pageSize: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        identityProvider: true,
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

    return users.map(
      (user) =>
        User.create(
          {
            name: Name.create(user.name).data,
            email: Email.create(user.email).data,
            isEmailVerified: user.isEmailVerified,
            loginCount: user.loginCount,
            createdAt: user.createdAt,
            ...(user.password && {
              password: Password.create(user.password, true).data,
            }),
            ...(user.identityProvider && {
              identityProvider: IdentityProvider.create(
                user.identityProvider.provider,
                user.identityProvider.identifier
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
        ).data
    );
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
      ...(user.identityProvider && {
        identityProvider: {
          connectOrCreate: {
            create: {
              provider: user.identityProvider.provider,
              identifier: user.identityProvider.identifier,
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
