import { Transporter, createTransport } from 'nodemailer';
import {
  EmailService,
  MailTemplates,
} from '../../../domain/services/email.service';
import { nodemailerConfig } from '../../config/nodemailer.config';

export class NodemailerService implements EmailService {
  private readonly transporter: Transporter;

  constructor(public readonly mailTemplates: MailTemplates) {
    this.transporter = createTransport({
      host: nodemailerConfig.host,
      port: nodemailerConfig.port,
      secure: nodemailerConfig.secure,
      auth: {
        user: nodemailerConfig.username,
        pass: nodemailerConfig.password,
      },
    });
  }

  private formatText<T>(text: string, data?: T): string {
    const regex = /{{(.*?)}}/g;
    const formattedText = text.replace(regex, (match, placeholder) => {
      placeholder = placeholder.trim();
      const replacement = (data as Record<string, unknown>)?.[
        placeholder
      ] as string;
      return replacement !== undefined ? replacement : match;
    });

    return formattedText;
  }

  async send<T>(
    to: string,
    subject: string,
    body: string,
    data?: T
  ): Promise<void> {
    await this.transporter.sendMail({
      from: nodemailerConfig.username,
      to,
      subject: this.formatText(subject, data),
      html: this.formatText(body, data),
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
