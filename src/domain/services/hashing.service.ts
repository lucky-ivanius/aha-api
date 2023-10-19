import { Password } from '../models/user/password';

export interface HashingService {
  hash(password: Password): Promise<Password> | Password;
  compare(
    hashedPassword: Password,
    plainTextPassword: string
  ): Promise<boolean> | boolean;
}
