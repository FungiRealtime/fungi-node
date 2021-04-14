import crypto from 'crypto';
import { Client } from '../Client';
import { TEST_BASE_URL } from '../mocks/handlers';

const CLIENT_KEY = 'test-key';
const CLIENT_SECRET = 'test-secret';

const client = new Client({
  httpEndpoint: TEST_BASE_URL,
  key: CLIENT_KEY,
  secret: CLIENT_SECRET,
});

const generateChannels = (amount: number) =>
  new Array(amount).fill(null).map((_, index) => `my-channel-${index}`);

describe('trigger batch', () => {
  test('allows up to 10 batched events', async () => {
    expect.assertions(2);

    const validBatch = await client.triggerBatch(
      generateChannels(10).map((channel, index) => ({
        channel,
        data: {},
        event: `${index}`,
      }))
    );

    expect(validBatch).toMatchInlineSnapshot(`
      Object {
        "events": Array [
          Object {
            "channel": "my-channel-0",
            "data": Object {},
            "event": "0",
          },
          Object {
            "channel": "my-channel-1",
            "data": Object {},
            "event": "1",
          },
          Object {
            "channel": "my-channel-2",
            "data": Object {},
            "event": "2",
          },
          Object {
            "channel": "my-channel-3",
            "data": Object {},
            "event": "3",
          },
          Object {
            "channel": "my-channel-4",
            "data": Object {},
            "event": "4",
          },
          Object {
            "channel": "my-channel-5",
            "data": Object {},
            "event": "5",
          },
          Object {
            "channel": "my-channel-6",
            "data": Object {},
            "event": "6",
          },
          Object {
            "channel": "my-channel-7",
            "data": Object {},
            "event": "7",
          },
          Object {
            "channel": "my-channel-8",
            "data": Object {},
            "event": "8",
          },
          Object {
            "channel": "my-channel-9",
            "data": Object {},
            "event": "9",
          },
        ],
      }
    `);

    try {
      await client.triggerBatch(
        generateChannels(11).map((channel, index) => ({
          channel,
          data: {},
          event: `${index}`,
        }))
      );
    } catch (error) {
      expect(error.message).toBe(
        `You can't trigger more than 10 batched events.`
      );
    }
  });
});

describe('trigger', () => {
  test('allows up to 10 unique channels', async () => {
    expect.assertions(2);

    const validEvent = await client.trigger(generateChannels(10), 'my-event', {
      hello: 'world',
    });

    expect(validEvent).toMatchInlineSnapshot(`
      Object {
        "channels": Array [
          "my-channel-0",
          "my-channel-1",
          "my-channel-2",
          "my-channel-3",
          "my-channel-4",
          "my-channel-5",
          "my-channel-6",
          "my-channel-7",
          "my-channel-8",
          "my-channel-9",
        ],
        "data": Object {
          "hello": "world",
        },
        "event": "my-event",
      }
    `);

    try {
      await client.trigger(generateChannels(11), 'my-event', {
        hello: 'world',
      });
    } catch (error) {
      expect(error.message).toBe(
        `You can't publish an event on more than 10 channels at once.`
      );
    }
  });

  test('posts valid event', async () => {
    expect.assertions(3);

    const singleChannelEvent = await client.trigger('my-channel', 'my-event', {
      hello: 'there',
    });

    expect(singleChannelEvent).toMatchInlineSnapshot(`
      Object {
        "channels": Array [
          "my-channel",
        ],
        "data": Object {
          "hello": "there",
        },
        "event": "my-event",
      }
    `);

    const multipleChannelsEvent = await client.trigger(
      ['my-channel-1', 'my-channel-2'],
      'my-event',
      {
        hello: 'there',
      }
    );

    expect(multipleChannelsEvent).toMatchInlineSnapshot(`
      Object {
        "channels": Array [
          "my-channel-1",
          "my-channel-2",
        ],
        "data": Object {
          "hello": "there",
        },
        "event": "my-event",
      }
    `);

    const superLongEventName =
      'YeFH2M5nziiwJvSgPDfv7lYLzu4oWFC8rcBaZHa4QDCySEPQboCjesANmzrywwVZsJtLLEjVymFPhsHHmuR9cSYo6fr6yQGC5TFO0ExZKdlx9Em3YFXnytDBB1QI9RqiAYBcWh0zR1eUjMEE42lY4Nu6TpDGj7BOc8fNxpjsyUW6ZVYD2AIIqdcLwUSi2OemBmMY0APAC';

    try {
      await client.trigger('my-channel', superLongEventName, {
        hello: 'there',
      });
    } catch (error) {
      expect(error.message).toBe(
        `The name of the event can't be longer than 200 characters.`
      );
    }
  });
});

describe('authenticate', () => {
  test('returns the correct auth signature', () => {
    const testSocketId = 'my-socket-123';
    const testChannelName = 'private-channel';

    const { auth } = client.authenticate(testSocketId, testChannelName);

    const stringToSign = `${testSocketId}:${testChannelName}`;
    const signature = crypto
      .createHmac('sha256', CLIENT_SECRET)
      .update(stringToSign)
      .digest('hex');

    const correctAuth = `${CLIENT_KEY}:${signature}`;

    expect(auth).toBe(correctAuth);
  });
});
