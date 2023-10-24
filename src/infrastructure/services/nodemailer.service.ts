import { Transporter, createTransport } from 'nodemailer';
import {
  EmailTemplates,
  MailData,
  MailService,
  TemplateMailData,
} from '../../application/services/mail.service';

export interface NodemailerConfigOptions {
  username: string;
  password: string;
  host: string;
  port: number;
  secure?: boolean;
}

export class NodemailerService implements MailService {
  private readonly transporter: Transporter;

  constructor(
    private readonly config: NodemailerConfigOptions,
    private readonly emailTemplates: EmailTemplates
  ) {
    this.transporter = createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.username,
        pass: this.config.password,
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

  async send<T>(data: MailData<T>): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.username,
      to: data.to,
      subject: this.formatText(data.subject, data.args),
      html: this.formatText(data.body, data.args),
    });
  }

  async sendWithTemplate<T>(data: TemplateMailData<T>): Promise<void> {
    const template = this.emailTemplates[data.template];

    await this.send({
      to: data.to,
      subject: template.subject,
      body: template.body,
      args: data.args,
    });
  }
}
