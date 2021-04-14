import crypto from 'crypto';
import { fetchWithTimeout } from './utils/fetchWithTimeout';
import { HttpError } from './HttpError';
import { BatchedEvent, ClientConfig, TriggeredEvent } from './types';
import { unique } from './utils/unique';

export class Client {
  constructor(private config: ClientConfig) {}

  /**
   * Authenticate a channel.
   * @param socketId The id of the socket to authenticate.
   * @param channelName The name of the channel to authenticate.
   * @returns An object with authentication parameters.
   */
  public authenticate(socketId: string, channelName: string) {
    const key = this.config.key;
    const secret = this.config.secret;
    const stringToSign = `${socketId}:${channelName}`;

    const signature = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('hex');

    const auth = `${key}:${signature}`;

    return { auth };
  }

  /**
   * Trigger up to ten events in one request.
   * @param events The events to be triggered. Up to 10.
   */
  public triggerBatch(events: BatchedEvent[]) {
    if (events.length > 10) {
      throw new Error(`You can't trigger more than 10 batched events.`);
    }

    return this.post('/events/trigger_batch', {
      events,
    });
  }

  /**
   * Trigger an event on a channel.
   * @param channels A string identifying a single channel or an array of strings
   * for multipe channels, up to 10 different channels.
   * @param event The name of the event.
   * @param data The object to be converted to JSON and distributed with the event.
   */
  public trigger(
    channels: string | string[],
    event: string,
    data: Record<string, unknown>
  ) {
    const arraifyedChannels =
      typeof channels === 'string' ? [channels] : channels;

    const uniqueChannels = unique(arraifyedChannels);

    if (uniqueChannels.length > 10) {
      throw new Error(
        `You can't publish an event on more than 10 channels at once.`
      );
    }

    if (event.length > 200) {
      throw new Error(
        `The name of the event can't be longer than 200 characters.`
      );
    }

    return this.post<TriggeredEvent>('/events/trigger', {
      channels: arraifyedChannels,
      event,
      data,
    });
  }

  private async post<TData>(path: string, body: Record<string, unknown>) {
    const res = await fetchWithTimeout(this.config.httpEndpoint + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.key}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = (await res.json()) as { message: string };
      throw new HttpError(res.status, error.message);
    }

    const data = (await res.json()) as TData;
    return data;
  }
}
