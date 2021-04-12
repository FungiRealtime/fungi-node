import { NextApiRequest, NextApiResponse } from 'next';
import { fungi } from '../../lib/fungi';

interface Body {
  channel_name: string;
  socket_id: string;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channel_name, socket_id } = req.body as Body;

  const auth = fungi.authenticate(socket_id, channel_name);

  return res.json(auth);
}
