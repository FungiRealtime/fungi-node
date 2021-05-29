import crypto from 'crypto';
import { fetchWithTimeout } from './utils/fetchWithTimeout';
import { HttpError } from './HttpError';
import {
  AuthResponse,
  BatchedEvent,
  FungiClientConfig,
  TriggeredEvent,
  WebhookEvent,
} from './types';
import { unique } from './utils/unique';

export class FungiClient {
  constructor(private config: FungiClientConfig) {}

  /**
   * Authenticate a channel.
   * @returns An object with authentication parameters.
   */
  public authenticate(
    /**
     * The id of the socket to authenticate
     */
    socketId: string,

    /**
     * The name of the channel to authenticate
     */
    channelName: string
  ): AuthResponse {
    let key = this.config.key;
    let secret = this.config.secret;
    let stringToSign = `${socketId}:${channelName}`;

    let signature = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('hex');

    let auth = `${key}:${signature}`;

    return { auth };
  }

  /**
   * Trigger up to ten events in one request.
   * @returns The batched events.
   * @throws Error
   */
  public triggerBatch(
    /**
     * The events to be triggered. Up to 10
     */
    events: BatchedEvent[]
  ) {
    if (events.length > 10) {
      throw new Error(`You can't trigger more than 10 batched events.`);
    }

    return this.post<BatchedEvent[]>('/events/trigger_batch', {
      events,
    });
  }

  /**
   * Trigger an event on a channel.
   * @returns The triggered event.
   * @throws Error
   */
  public trigger(
    /**
     * A string identifying a single channel or an array of channels
     * for multipe channels, up to 10 different channels.
     */
    channels: string | string[],

    /**
     * The name of the event.
     */
    event: string,

    /**
     * The object to be converted to JSON and distributed with the event
     */
    data: Record<string, unknown>
  ) {
    let arraifyedChannels =
      typeof channels === 'string' ? [channels] : channels;

    let uniqueChannels = unique(arraifyedChannels);

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

  /**
   * Constructs and verifies the signature of an event from the provided details.
   *
   * @returns The event.
   * @throws Error
   */
  public constructEvent(
    /**
     * JSON body payload stringified received from Fungi.
     */
    payload: string,

    /**
     * Value of the `Fungi-Signature` header from Fungi.
     */
    header: string,

    /**
     * Your Webhooks Signing Secret.
     * This is configured as an [environment variable of Fungi](https://fungirealti.me/docs/01-getting-started/02-installation#environment-variables).
     */
    secret: string,

    /**
     * Seconds of tolerance on timestamps.
     */
    tolerance?: number
  ): WebhookEvent {
    if (!header) {
      throw new Error('Invalid Fungi-Signature header');
    }

    let rawTs, rawSig, ts, signature;

    try {
      [rawTs, rawSig] = header.split(',');
      [, ts] = rawTs.split('=');
      [, signature] = rawSig.split('=');
    } catch (error) {
      throw new Error('Invalid signature');
    }

    if (tolerance) {
      let toleranceInMs = tolerance * 1000;
      let toleratedTs = Number(ts) + toleranceInMs;

      if (Date.now() > toleratedTs) {
        throw new Error('Invalid signature (intolerant)');
      }
    }

    let expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${ts}:${payload}`)
      .digest('hex');

    let signatureBuffer = Buffer.from(signature, 'hex');
    let expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
    let isValidSignature = crypto.timingSafeEqual(
      signatureBuffer,
      expectedSignatureBuffer
    );

    if (!isValidSignature) {
      throw new Error('Invalid signature (invalid HMAC)');
    }

    return JSON.parse(payload);
  }

  private async post<TData>(path: string, body: Record<string, unknown>) {
    let res = await fetchWithTimeout(this.config.url + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.key}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let error = (await res.json()) as { message: string };
      throw new HttpError(res.status, error.message);
    }

    let data = (await res.json()) as TData;
    return data;
  }
}
