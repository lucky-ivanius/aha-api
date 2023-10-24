import { Session } from '../models/session/session';

export interface SessionsRepository {
  avgSessionByDateRange(startDate: Date, endDate: Date): Promise<number>;
  countSessionByDate(date: Date): Promise<number>;
  save(session: Session): Promise<void>;
}
