import { Session } from '../models/session/session';

export interface SessionsRepository {
  avgSessionByDateRange(startDate: Date, endDate: Date): Promise<number>;
  countSessionByDate(date: Date): Promise<number>;
  getSessionByToken(token: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
}
