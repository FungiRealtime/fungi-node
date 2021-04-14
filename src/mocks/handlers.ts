import { rest } from 'msw';
import { wait } from '../utils/wait';

export const TEST_BASE_URL = 'http://localhost:9999';
export const HANDLER_WAIT_MS = 10;

export const handlers = [
  // Handler for testing timeouts.
  rest.get(TEST_BASE_URL + '/timeout', async (_req, res, ctx) => {
    await wait(HANDLER_WAIT_MS);
    return res(ctx.status(200));
  }),

  rest.post(TEST_BASE_URL + '/events/trigger', (req, res, ctx) => {
    return res(ctx.json(req.body), ctx.status(200));
  }),

  rest.post(TEST_BASE_URL + '/events/trigger_batch', (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
