import { Guard } from '../../common/guard';
import { Result } from '../../common/result';

export interface IdentityProviderProps<MetadataType> {
  provider: string;
  identifier: string;
  metadata: MetadataType;
}

export class IdentityProvider<MetadataType>
  implements IdentityProviderProps<MetadataType>
{
  get provider() {
    return this.props.provider;
  }

  get identifier() {
    return this.props.identifier;
  }

  get metadata() {
    return this.props.metadata;
  }

  private constructor(
    private readonly props: IdentityProviderProps<MetadataType>
  ) {}

  static create<MetadataType>(
    provider: string,
    identifier: string,
    metadata?: MetadataType
  ): Result<IdentityProvider<MetadataType>> {
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
      new IdentityProvider<MetadataType>({
        provider,
        identifier,
        metadata: metadata ?? ({} as MetadataType),
      })
    );
  }
}
