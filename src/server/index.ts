import express from 'express';
import http from 'http';
import morgan from 'morgan';
import {createSocket} from './webSocket';
import * as config from '../config';
import * as routes from './routes';

const headers = (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
  });
  return next();
};

export const start = () => {

  const app = express();
  const port = process.env.PORT || config.PORT;
  const server = http.createServer(app);
  const wss = createSocket(server);

  app
    .use(morgan('dev'))
    .use(headers)
    .get('/', routes.root);

  server.listen(port, () =>
    console.log(`Server listening at: ${port}`));

  wss.on('connection', ws => {
    app.ws = ws;
    console.log('ws has been injected');
  });
};
