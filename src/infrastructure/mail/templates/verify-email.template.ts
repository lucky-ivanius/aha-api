import { MailTemplate } from '../../../application/services/mail.service';

export const verifyEmailTemplate: MailTemplate = {
  subject: 'Hi, {{name}}',
  body: 'Verify: {{verifyEndpoint}}?token={{token}}',
};
