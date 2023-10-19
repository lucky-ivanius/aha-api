import { MailTemplate } from '../../../domain/services/email.service';

export const verifyEmailTemplate: MailTemplate = {
  subject: 'Hi, {{name}}',
  body: 'Verify: {{url}}/api/v1/users/verify?token={{token}}',
};
