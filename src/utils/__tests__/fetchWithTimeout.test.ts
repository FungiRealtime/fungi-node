import AbortController from 'abort-controller';
import { TEST_BASE_URL, HANDLER_WAIT_MS } from '../../mocks/handlers';
import { fetchWithTimeout } from '../fetchWithTimeout';

test('request is successful if response is received before timeout', async () => {
  const response = await fetchWithTimeout(
    TEST_BASE_URL + '/timeout',
    undefined,
    undefined,
    HANDLER_WAIT_MS * 2
  );

  expect(response.ok).toBe(true);
});

test('request is aborted after timeout', async () => {
  expect.assertions(1);

  try {
    await fetchWithTimeout(
      TEST_BASE_URL + '/timeout',
      undefined,
      undefined,
      HANDLER_WAIT_MS - HANDLER_WAIT_MS / 2
    );
  } catch (e) {
    expect(e.name).toBe('AbortError');
  }
});

test('allows external abort controller', async () => {
  expect.assertions(2);

  const controller = new AbortController();

  try {
    await fetchWithTimeout(
      TEST_BASE_URL + '/timeout',
      undefined,
      controller,
      HANDLER_WAIT_MS - HANDLER_WAIT_MS / 2
    );
  } catch (e) {
    expect(e.name).toBe('AbortError');
  }

  expect(controller.signal.aborted).toBe(true);
});
