import { SessionsRepository } from '../../domain/repositories/sessions.repository';

export function getSessionsRepositoryMock(
  custom?: Partial<SessionsRepository>
): SessionsRepository {
  return {
    avgSessionByDateRange: jest.fn(),
    countSessionByDate: jest.fn(),
    getSessionByToken: jest.fn(),
    save: jest.fn(),
    ...custom,
  };
}
