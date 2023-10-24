import { Id } from '../common/id';
import { User } from '../models/user/user';

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: Id): Promise<User | null>;
  findByProvider(provider: string, identifier: string): Promise<User | null>;
  getUserList(page: number, perPage: number): Promise<User[]>;
  isUserVerified(userId: Id): Promise<boolean>;
  count(): Promise<number>;
  save(user: User): Promise<void>;
}
