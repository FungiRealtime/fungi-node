import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

interface Body {
  channel_name: string;
  socket_id: string;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channel_name, socket_id } = req.body as Body;

  const key = process.env.FUNGI_KEY!;
  const secret = process.env.FUNGI_SECRET!;
  const stringToSign = `${socket_id}:${channel_name}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(stringToSign)
    .digest('hex');

  const auth = `${key}:${signature}`;

  return res.json({ auth });
}
