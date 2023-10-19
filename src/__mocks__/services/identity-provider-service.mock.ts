import { IdentityProviderService } from '../../domain/services/identity-provider.service';

export function getIdentityProviderServiceMock(
  custom?: Partial<IdentityProviderService>
): IdentityProviderService {
  return {
    providerName: 'anything',

    getUserInfo: jest.fn(),
    verify: jest.fn(),
    changePassword: jest.fn(),
    ...custom,
  };
}
