import WebSocket from 'ws';

export const createSocket = server =>
  new WebSocket.Server({server});
