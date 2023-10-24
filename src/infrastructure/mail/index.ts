import { EmailTemplates } from '../../application/services/mail.service';
import { verifyEmailTemplate } from './templates/verify-email.template';

export const emailTemplates: EmailTemplates = {
  VERIFY_EMAIL: verifyEmailTemplate,
};
