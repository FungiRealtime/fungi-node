import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import AbortController from 'abort-controller';

export function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
  externalController?: AbortController,
  timeoutMs: number = 2000
) {
  let controller = externalController ?? new AbortController();

  let fetchPromise = fetch(input, { signal: controller.signal, ...init });

  // Abort the request after specified timeout in ms.
  let timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetchPromise.finally(() => clearTimeout(timeout));
}
