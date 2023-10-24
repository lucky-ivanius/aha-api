import { Router } from 'express';
import { serve, setup } from 'swagger-ui-express';
import docFile from '../../../docs/index.json';

const docsRouter = Router();

const customCssUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
const swaggerServe = serve;
const swaggerSetup = setup(docFile, { customCssUrl });

docsRouter.use('/', swaggerServe);
docsRouter.get('/', swaggerSetup);

export { docsRouter };
