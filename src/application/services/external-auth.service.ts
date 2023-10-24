import { Id } from '../../domain/common/id';
import { User } from '../../domain/models/user/user';

export interface ExternalAuthService {
  getUserByToken(accessToken: string): Promise<User | null>;
  getUserById(userId: Id): Promise<User | null>;
  save(user: User): Promise<void>;
}
