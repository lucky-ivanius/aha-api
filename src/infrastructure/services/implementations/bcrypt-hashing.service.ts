import { compare, genSalt, hash } from 'bcrypt';
import { Password } from '../../../domain/models/user/password';
import { HashingService } from '../../../domain/services/hashing.service';

export class BcryptHashingService implements HashingService {
  async hash(password: Password): Promise<Password> {
    if (password.isHashed) return password;

    const salt = await genSalt();
    const hashedPassword = await hash(password.value, salt);

    return Password.create(hashedPassword, true).data;
  }

  async compare(
    hashedPassword: Password,
    plainTextPassword: string
  ): Promise<boolean> {
    if (!hashedPassword.isHashed)
      return hashedPassword.value === plainTextPassword;

    const compareResult = await compare(
      plainTextPassword,
      hashedPassword.value
    );

    return compareResult;
  }
}
