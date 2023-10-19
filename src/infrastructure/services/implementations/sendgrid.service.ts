import { MailService } from '@sendgrid/mail';
import {
  EmailService,
  MailTemplates,
} from '../../../domain/services/email.service';
import { sendGridConfig } from '../../config/sendgrid.config';

export class SendgridService implements EmailService {
  private readonly mailService: MailService;

  constructor(
    readonly apiKey: string,
    public readonly mailTemplates: MailTemplates
  ) {
    this.mailService = new MailService();
    this.mailService.setApiKey(apiKey);
  }

  async send<T>(
    to: string,
    subject: string,
    body: string,
    data?: T
  ): Promise<void> {
    await this.mailService.send({
      from: {
        email: sendGridConfig.noReplyEmail,
      },
      subject,
      to,
      html: body,
      customArgs: data as object,
    });
  }

  async sendWithTemplate<T>(
    to: string,
    templateName: string,
    data?: T
  ): Promise<void> {
    const template = this.mailTemplates[templateName];

    await this.send(to, template.subject, template.body, data);
  }
}
