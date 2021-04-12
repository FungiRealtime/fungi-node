import { HttpError } from '../../../..';
import { NextApiRequest, NextApiResponse } from 'next';
import { fungi } from '../../lib/fungi';

export default async function handle(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await fungi.trigger('private-count', 'increment', {
      amount: 1,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }

  res.json({ ok: true });
}
