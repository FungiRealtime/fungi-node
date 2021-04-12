export interface ClientConfig {
  /**
   * The endpoint at which the Fungi http server is available.
   * ```
   * const fungi = new Client({
   *   wsEndpoint: 'ws://your-app.com',
   *   httpEndpoint: 'https://your-app.com'
   * })
   * ```
   */
  httpEndpoint: string;

  /**
   * The app's key.
   */
  key: string;
}

export interface BatchedEvent {
  channel: string;
  event: string;
  data: Record<string, unknown>;
}
