export interface ClientConfig {
  /**
   * The endpoint at which Fungi's REST API is available. This is required for triggering events.
   * ```
   * const client = new Client({
   *   httpEndpoint: 'https://your-app.com'
   * })
   * ```
   */
  httpEndpoint?: string;

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
