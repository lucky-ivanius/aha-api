import { auth0Config } from '../config/auth0.config';
import { mailTemplates } from '../mail';
import { Auth0Service } from './implementations/auth0.service';
import { BcryptHashingService } from './implementations/bcrypt-hashing.service';
import { JwtService } from './implementations/jwt.service';
import { NodemailerService } from './implementations/nodemailer.service';

export const auth0Service = new Auth0Service(
  auth0Config.domain,
  auth0Config.clientId,
  auth0Config.clientSecret,
  auth0Config.jwksUri
);

export const bcryptHashingService = new BcryptHashingService();

export const jwtService = new JwtService();

export const nodemailerService = new NodemailerService(mailTemplates);
