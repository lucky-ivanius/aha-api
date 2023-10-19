import { serve, setup } from 'swagger-ui-express';
import docFile from '../../../docs/index.json';

const customCssUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

export const swaggerServe = serve;
export const swaggerSetup = setup(docFile, { customCssUrl });
