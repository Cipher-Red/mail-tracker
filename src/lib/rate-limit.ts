// Define a type for Timeout
type Timeout = ReturnType<typeof setTimeout>;

export interface RateLimitOptions {
  interval: number;
  limit: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitStore {
  tokens: Map<string, number[]>;
  timeout: Timeout | null;
}

export function rateLimit(options: RateLimitOptions) {
  const { interval, limit, uniqueTokenPerInterval } = options;
  
  const store: RateLimitStore = {
    tokens: new Map(),
    timeout: null,
  };

  // Clear tokens after the interval
  const resetTokens = () => {
    store.tokens.clear();
    if (store.timeout) {
      clearTimeout(store.timeout);
      store.timeout = null;
    }
  };

  return {
    check: (token: string, weight = 1): Promise<void> => {
      // Initialize the timeout if it doesn't exist
      if (!store.timeout) {
        store.timeout = setTimeout(resetTokens, interval);
      }

      // Get current token usage
      const tokenCount = store.tokens.get(token) || [];
      const currentUsage = tokenCount.reduce((acc, val) => acc + val, 0);

      // Check if adding the new weight would exceed the limit
      if (currentUsage + weight > limit) {
        return Promise.reject(new Error('Rate limit exceeded'));
      }

      // Update token usage
      tokenCount.push(weight);
      store.tokens.set(token, tokenCount);

      // Ensure we don't store too many unique tokens
      if (store.tokens.size > uniqueTokenPerInterval) {
        // Delete the oldest token
        const oldestToken = Array.from(store.tokens.keys())[0];
        store.tokens.delete(oldestToken);
      }

      return Promise.resolve();
    },
  };
}
