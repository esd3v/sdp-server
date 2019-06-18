import WebSocket from 'ws';
import * as config from '../config';

export const wss = new WebSocket.Server({
  port: config.WSPORT,
});
