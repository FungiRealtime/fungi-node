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

  /**
   * The app's secret.
   */
  secret: string;
}

export interface BatchedEvent {
  channel: string;
  event: string;
  data: Record<string, unknown>;
}

export interface TriggeredEvent {
  channels: string[];
  event: string;
  data: Record<string, unknown>;
}

export interface AuthResponse {
  auth: string;
}
