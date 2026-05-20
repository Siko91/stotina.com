/**
 * Simple client for the public CoinGecko exchange rates endpoint.
 *
 * The endpoint https://api.coingecko.com/api/v3/exchange_rates returns a JSON
 * payload with rates for >150 fiat currencies and >6000 cryptocurrencies.
 * All rates are expressed relative to Bitcoin (BTC). This makes conversion
 * between any two currencies straightforward: `target/value / source/value`.
 *
 * To avoid hitting the free‑tier rate limit and to keep the UI snappy we cache
 * the response in `localStorage` for a short period (10 minutes). The cache
 * key is `coingecko_rates` and stores an object `{ timestamp: number, data: object }`.
 */

const COINGECKO_ENDPOINT = "https://api.coingecko.com/api/v3/exchange_rates";
const CACHE_KEY = "coingecko_rates";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Retrieve the exchange rates, using the cache when possible.
 * @param {boolean} [forceRefresh=false] - Bypass the cache and fetch fresh data.
 * @returns {Promise<Object>} Resolves with the `rates` object from the API.
 */
export async function getRates(forceRefresh = false) {
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          // Cached data is still fresh.
          return data.rates;
        }
      }
    } catch (e) {
      // If parsing fails we simply ignore the cache and fetch fresh data.
    }
  }

  const response = await fetch(COINGECKO_ENDPOINT);
  if (!response.ok) {
    throw new Error(`CoinGecko request failed: ${response.status}`);
  }
  const json = await response.json();
  // Store in cache for future calls.
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: json })
    );
  } catch (e) {
    // If storage fails (e.g., quota) we silently ignore – the next call will
    // fetch again.
  }
  return json.rates;
}

/**
 * Helper to format a numeric value based on the target currency type.
 * Crypto values are shown with 6 decimal places, fiat values with 2.
 * @param {number} value - The raw conversion result.
 * @param {string} type - "crypto" or "fiat" (as provided by the API).
 * @returns {string}
 */
export function formatRate(value, type) {
  if (type === "crypto") {
    return value.toFixed(6);
  }
  return value.toFixed(2);
}
