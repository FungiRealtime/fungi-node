export interface FungiClientConfig {
  /**
   * The url at which Fungi's REST API is available. This is required for triggering events.
   * ```
   * let fungi = new FungiClient({
   *   url: 'https://your-app.com'
   * })
   * ```
   */
  url?: string;

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

export interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
}
