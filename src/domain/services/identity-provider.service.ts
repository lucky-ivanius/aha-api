import { User } from '../models/user/user';

export interface IdentityProviderService {
  readonly providerName: string;

  getUserInfo(accessToken: string): Promise<User | null>;
  changePassword(user: User, password: string): Promise<void>;
  verify<T>(accessToken: string): Promise<T | null>;
}
