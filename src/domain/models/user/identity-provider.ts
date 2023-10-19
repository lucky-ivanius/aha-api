import { Guard } from '../../common/guard';
import { Result } from '../../common/result';

export interface IdentityProviderProps {
  provider: string;
  identifier: string;
  allowChangePassword: boolean;
}

export class IdentityProvider implements IdentityProviderProps {
  get provider() {
    return this.props.provider;
  }

  get identifier() {
    return this.props.identifier;
  }

  get allowChangePassword() {
    return this.props.allowChangePassword;
  }

  private constructor(private readonly props: IdentityProviderProps) {}

  static create(
    provider: string,
    identifier: string,
    allowChangePassword?: boolean
  ): Result<IdentityProvider> {
    const providerRequiredGuard = Guard.required({
      name: 'Provider',
      value: provider,
    });
    const identifierRequiredGuard = Guard.required({
      name: 'Identifier',
      value: identifier,
    });

    const guardResult = Result.combine(
      providerRequiredGuard,
      identifierRequiredGuard
    );
    if (!guardResult.isSuccess) return Result.fail(guardResult.error);

    return Result.ok(
      new IdentityProvider({
        provider,
        identifier,
        allowChangePassword: allowChangePassword ?? false,
      })
    );
  }
}
