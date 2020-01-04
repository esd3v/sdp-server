import express from 'express';
import http from 'http';
import morgan from 'morgan';
import * as webSocket from '../webSocket';
import * as wsMessages from '../wsMessages';
import * as config from '../config';
import {handleWSMessage} from '../misc';
import * as routes from './routes';

const headers = (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': req['headers']['origin'],
    'Access-Control-Allow-Headers': 'x-session-id',
    'Access-Control-Allow-Credentials': true,
  });
  return next();
};

export const start = () => {

  const app = express();
  const port = process.env.PORT || config.PORT;
  const server = http.createServer(app);
  const wss = webSocket.createServer({server});

  app
    .use(morgan('dev'))
    .use(headers)
    .get('/', routes.root);

  server.listen(port, () =>
    console.log(`Server listening at: ${port}`));

  wss.on('connection', ws => {

    ws.on('message', (message: string) => {
      const {sessionID} = handleWSMessage(message);

      if (sessionID) {
        webSocket.setSocket(ws, sessionID);
        ws.send(wsMessages.wsOpened);

        ws.on('close', () => {
          webSocket.deleteSocket(sessionID);
        });
      }
    });
  });
};
