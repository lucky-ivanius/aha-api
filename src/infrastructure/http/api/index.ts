import bodyParser from 'body-parser';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiConfig } from '../../config/api.config';
import { swaggerServe, swaggerSetup } from './routes/docs';
import { router as v1 } from './routes/v1';

const corsOptions: CorsOptions = {
  origin: apiConfig.origin,
};

const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors(corsOptions))
  .use(compression())
  .use(helmet())
  .use(morgan('dev'));

app.get('/', (req, res) => {
  return res.json({ message: 'Hi 💕' });
});

app.use('/api/v1', v1);
app.use('/api/docs', swaggerServe, swaggerSetup);

const port = apiConfig.port;

app.listen(port, () => {
  console.log(`Running on port ${port}! 🚀🚀🚀`);
});
