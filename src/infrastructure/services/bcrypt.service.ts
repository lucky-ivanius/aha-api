import { compare, genSalt, hash } from 'bcrypt';
import { HashingService } from '../../application/services/hashing.service';
import { Password } from '../../domain/models/user/password';

export class BcryptService implements HashingService {
  constructor(private readonly saltOrRound?: string | number) {}

  async hash(password: Password): Promise<Password> {
    if (password.isHashed) return password;

    const saltOrRound = this.saltOrRound ?? (await genSalt());
    const hashedPassword = await hash(password.value, saltOrRound);

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
