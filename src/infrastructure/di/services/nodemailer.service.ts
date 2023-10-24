import { nodemailerConfig } from '../../config/nodemailer.config';
import { emailTemplates } from '../../mail';
import { NodemailerService } from '../../services/nodemailer.service';

export const nodemailerService = new NodemailerService(
  nodemailerConfig,
  emailTemplates
);
