import { MailService } from '../../application/services/mail.service';

export function getMailServiceMock(custom?: Partial<MailService>): MailService {
  return {
    send: jest.fn(),
    sendWithTemplate: jest.fn(),
    ...custom,
  };
}
