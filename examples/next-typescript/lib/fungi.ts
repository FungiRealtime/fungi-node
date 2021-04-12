import { Client } from '../../..';

export const fungi = new Client({
  httpEndpoint: 'http://localhost:8081',
  key: process.env.FUNGI_KEY,
  secret: process.env.FUNGI_SECRET,
});
