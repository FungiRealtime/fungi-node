import crypto from 'crypto';
import { WebhookEvent } from '../types';

export function generateSignature(
  secret: string,
  secondsToSubtractToTs?: number
) {
  let payload: WebhookEvent = {
    type: 'test',
    data: {
      some: 'data',
    },
  };

  let timestamp = secondsToSubtractToTs
    ? Date.now() - secondsToSubtractToTs * 1000
    : Date.now();

  let jsonEvent = JSON.stringify(payload);

  let signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}:${jsonEvent}`)
    .digest('hex');

  let header = `ts=${timestamp},sig=${signature}`;

  return { header, payload };
}
