import { TokenService } from '../../application/services/token.service';

export function getTokenServiceMock(
  custom?: Partial<TokenService>
): TokenService {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
    ...custom,
  };
}
