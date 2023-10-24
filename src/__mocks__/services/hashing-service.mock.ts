import { HashingService } from '../../application/services/hashing.service';

export function getHashingServiceMock(
  custom?: Partial<HashingService>
): HashingService {
  return {
    hash: jest.fn(),
    compare: jest.fn(),
    ...custom,
  };
}
