import { serve, setup } from 'swagger-ui-express';
import docFile from '../../../docs/index.json';

export const swaggerServe = serve;
export const swaggerSetup = setup(docFile);

import { Router } from 'express';

const docsRouter = Router();

docsRouter.use('/', swaggerServe);
docsRouter.get('/', swaggerSetup);

export { docsRouter };
