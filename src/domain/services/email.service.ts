export interface MailTemplate {
  subject: string;
  body: string;
}

export type MailTemplates = Record<string, MailTemplate>;

export interface EmailService {
  readonly mailTemplates: MailTemplates;

  send<T>(to: string, subject: string, body: string, data?: T): Promise<void>;
  sendWithTemplate<T>(
    to: string,
    templateName: string,
    data?: T
  ): Promise<void>;
}
