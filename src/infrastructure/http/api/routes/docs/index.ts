import { RequestHandler } from 'express-serve-static-core';
import { serve, setup } from 'swagger-ui-express';
import docFile from '../../../docs/index.json';

export const swaggerRender: RequestHandler = (req, res, next) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');

  next();
};
export const swaggerServe = serve;
export const swaggerSetup = setup(docFile);
