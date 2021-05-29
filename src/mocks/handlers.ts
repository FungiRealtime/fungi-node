import { rest } from 'msw';
import { wait } from '../utils/wait';

export let TEST_BASE_URL = 'http://localhost:9999';
export let HANDLER_WAIT_MS = 50;

export let handlers = [
  // Handler for testing timeouts.
  rest.get(TEST_BASE_URL + '/timeout', async (_req, res, ctx) => {
    await wait(HANDLER_WAIT_MS);
    return res(ctx.status(200));
  }),

  rest.post(TEST_BASE_URL + '/events/trigger', (req, res, ctx) => {
    return res(ctx.json(req.body), ctx.status(200));
  }),

  rest.post(TEST_BASE_URL + '/events/trigger_batch', (req, res, ctx) => {
    return res(ctx.json(req.body), ctx.status(200));
  }),
];
