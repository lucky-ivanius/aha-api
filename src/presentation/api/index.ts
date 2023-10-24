import bodyParser from 'body-parser';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiConfig } from '../../infrastructure/config/api.config';
import { docsRouter } from './routes/docs';
import { v1Router } from './routes/v1';

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

app.use('/api/v1', v1Router);
app.use('/api/docs', docsRouter);

const port = apiConfig.port;

app.listen(port, () => {
  console.log(`Running on port ${port}! 🚀🚀🚀`);
});
