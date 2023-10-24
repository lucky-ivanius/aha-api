import { MailService as SendgridMailService } from '@sendgrid/mail';
import {
  EmailTemplates,
  MailData,
  MailService,
  TemplateMailData,
} from '../../application/services/mail.service';

export class SendgridService implements MailService {
  private readonly mailService: SendgridMailService;

  constructor(
    readonly apiKey: string,
    readonly sender: string,
    private readonly emailTemplates: EmailTemplates
  ) {
    this.mailService = new SendgridMailService();
    this.mailService.setApiKey(apiKey);
  }

  async send<T>(data: MailData<T>): Promise<void> {
    await this.mailService.send({
      from: {
        email: this.sender,
      },
      subject: data.subject,
      to: data.to,
      html: data.body,
      customArgs: data.args ?? {},
    });
  }

  async sendWithTemplate<T>(data: TemplateMailData<T>): Promise<void> {
    const template = this.emailTemplates[data.template];

    await this.send({
      to: data.to,
      body: template.body,
      subject: template.subject,
      args: data.args,
    });
  }
}
