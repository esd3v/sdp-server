import WebSocket from 'ws';

let server: WebSocket.Server;
const sockets = new Map<string, WebSocket | undefined>();

const getServer = () => server;

export const getSocket = (id: string) =>
  sockets.get(id);

export const deleteSocket = (id: string) =>
  sockets.delete(id);

export const createServer = (options: WebSocket.ServerOptions) => {
  if (server) {
    throw new Error(`WebSocket server is already initialized. Use ${getServer.name}() instead.`);
  } else {
    server = new WebSocket.Server(options);
    return server;
  }
};

export const setSocket = (ws: WebSocket, id: string) => {
  sockets.set(id, ws);
};

export {getServer};
