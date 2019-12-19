import {IncomingMessage} from 'http';
import cookie from 'cookie';

const getRawCookies = (req: IncomingMessage) =>
  req?.headers['cookie'];

export const getCookies = (req: IncomingMessage): {
  [key in Cookies]?: string | undefined;
} => {
  const cookies = getRawCookies(req);
  return cookies ? cookie.parse(cookies) : {};
};
