import { UsersRepository } from '../../domain/repositories/users.repository';

export function getUsersRepositoryMock(
  custom?: Partial<UsersRepository>
): UsersRepository {
  return {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    getUserList: jest.fn(),
    isUserVerified: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    ...custom,
  };
}
