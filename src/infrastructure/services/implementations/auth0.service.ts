import { ManagementClient, UserInfoClient } from 'auth0';
import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { Email } from '../../../domain/models/user/email';
import { IdentityProvider } from '../../../domain/models/user/identity-provider';
import { Name } from '../../../domain/models/user/name';
import { User } from '../../../domain/models/user/user';
import { IdentityProviderService } from '../../../domain/services/identity-provider.service';

export class Auth0Service implements IdentityProviderService {
  public readonly providerName = 'auth0';

  private readonly managementClient: ManagementClient;

  private readonly userInfoClient: UserInfoClient;

  private readonly jwksClient: JwksClient;

  constructor(
    readonly domain: string,
    readonly clientId: string,
    readonly clientSecret: string,
    readonly jwksUri: string
  ) {
    this.managementClient = new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });
    this.userInfoClient = new UserInfoClient({
      domain,
    });
    this.jwksClient = new JwksClient({
      jwksUri,
    });
  }

  async getUserInfo(accessToken: string): Promise<User | null> {
    try {
      const result = await this.userInfoClient.getUserInfo(accessToken);

      const user = result.data;

      const allowChangePassword = user.sub.startsWith('auth0');

      const userResult = User.create({
        name: Name.create(user.name).data,
        email: Email.create(user.email).data,
        isEmailVerified: user.email_verified,
        identityProvider: IdentityProvider.create(
          this.providerName,
          user.sub,
          allowChangePassword
        ).data,
        loginCount: 0,
        createdAt: new Date(),
      });

      return userResult.data;
    } catch (err) {
      return null;
    }
  }

  async verify<T>(accessToken: string): Promise<T | null> {
    try {
      const decodedToken = decode(accessToken, { complete: true });

      const signingKey = await this.jwksClient.getSigningKey(
        decodedToken?.header.kid
      );

      const result = verify(accessToken, signingKey.getPublicKey());

      return result as T;
    } catch (error) {
      return null;
    }
  }

  async changePassword(user: User, password: string): Promise<void> {
    try {
      await this.managementClient.users.update(
        {
          id: user.identityProvider!.identifier,
        },
        {
          password,
        }
      );
    } catch (error) {}
  }
}
