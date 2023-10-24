import { ExternalAuthService } from '../../application/services/external-auth.service';

export function getExternalAuthServiceMock(
  custom?: Partial<ExternalAuthService>
): ExternalAuthService {
  return {
    getUserByToken: jest.fn(),
    getUserById: jest.fn(),
    save: jest.fn(),
    ...custom,
  };
}
