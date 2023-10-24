import { User } from '../../domain/models/user/user';

export interface ExternalAuthService {
  getUserByToken(accessToken: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
