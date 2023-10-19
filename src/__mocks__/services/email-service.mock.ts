import { EmailService } from '../../domain/services/email.service';

export function getEmailServiceMock(
  custom?: Partial<EmailService>
): EmailService {
  return {
    mailTemplates: {},

    send: jest.fn(),
    sendWithTemplate: jest.fn(),
    ...custom,
  };
}
