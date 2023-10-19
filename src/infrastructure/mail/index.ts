import { MailTemplates } from '../../domain/services/email.service';
import { verifyEmailTemplate } from './templates/verify-email.template';

export const mailTemplates: MailTemplates = {
  verifyEmail: verifyEmailTemplate,
};
