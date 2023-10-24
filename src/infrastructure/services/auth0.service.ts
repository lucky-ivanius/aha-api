import { ManagementClient, UserInfoClient } from 'auth0';
import { Auth0Metadata } from '../../application/dtos/external/auth0/auth0-metadata.dto';
import { ExternalAuthService } from '../../application/services/external-auth.service';
import { Id } from '../../domain/common/id';
import { Email } from '../../domain/models/user/email';
import { IdentityProvider } from '../../domain/models/user/identity-provider';
import { Name } from '../../domain/models/user/name';
import { User } from '../../domain/models/user/user';

export class Auth0Service implements ExternalAuthService {
  public readonly providerName = 'auth0';

  private readonly managementClient: ManagementClient;

  private readonly userInfoClient: UserInfoClient;

  constructor(
    readonly domain: string,
    readonly clientId: string,
    readonly clientSecret: string
  ) {
    this.managementClient = new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });
    this.userInfoClient = new UserInfoClient({
      domain,
    });
  }

  async getUserByToken(accessToken: string): Promise<User | null> {
    try {
      const result = await this.userInfoClient.getUserInfo(accessToken);

      const user = result.data;

      const allowChangePassword = user.sub.startsWith('auth0');

      const userResult = User.create({
        name: Name.create(user.name).data,
        email: Email.create(user.email).data,
        isEmailVerified: user.email_verified,
        provider: IdentityProvider.create<Auth0Metadata>(
          this.providerName,
          user.sub,
          {
            allowChangePassword,
          }
        ).data,
        loginCount: 0,
        createdAt: new Date(),
      });

      return userResult.data;
    } catch (err) {
      return null;
    }
  }

  async getUserById(userId: Id): Promise<User | null> {
    console.log(userId);
    return null;
  }

  async save(user: User): Promise<void> {
    await this.managementClient.users.update(
      {
        id: user.provider!.identifier,
      },
      {
        password: user.password?.value,
      }
    );
  }
}
