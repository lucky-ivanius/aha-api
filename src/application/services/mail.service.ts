export interface MailTemplate {
  subject: string;
  body: string;
}

export type EmailTemplateName = 'VERIFY_EMAIL';

export type EmailTemplates = {
  [key in EmailTemplateName]: MailTemplate;
};

export interface MailData<T> {
  to: string | string[];
  subject: string;
  body: string;
  args?: T;
}

export interface TemplateMailData<T> {
  to: string | string[];
  template: EmailTemplateName;
  args?: T;
}

export interface MailService {
  send<T>(data: MailData<T>): Promise<void>;
  sendWithTemplate<T>(data: TemplateMailData<T>): Promise<void>;
}
