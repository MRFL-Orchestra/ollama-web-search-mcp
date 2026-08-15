/**
 * Ollama API client for web search and web fetch endpoints.
 *
 * @see https://docs.ollama.com/capabilities/web-search
 */

export interface WebSearchResult {
  title: string;
  url: string;
  content: string;
}

export interface WebSearchResponse {
  results: WebSearchResult[];
}

export interface WebFetchResponse {
  title: string;
  content: string;
  links: string[];
}

const OLLAMA_BASE_URL = "https://ollama.com";

/**
 * Resolve the API key from environment or provided argument.
 * Throws if no key is available.
 */
function resolveApiKey(explicitKey?: string): string {
  const key = explicitKey ?? process.env.OLLAMA_API_KEY;
  if (!key) {
    throw new Error(
      "OLLAMA_API_KEY is required. Set it as an environment variable or pass it explicitly."
    );
  }
  return key;
}

/**
 * Perform a web search using Ollama's hosted search API.
 *
 * @param query - The search query string
 * @param maxResults - Maximum results to return (default 5, max 10)
 * @param apiKey - Optional API key (defaults to OLLAMA_API_KEY env var)
 * @returns Search results from Ollama
 */
export async function webSearch(
  query: string,
  maxResults: number = 5,
  apiKey?: string
): Promise<WebSearchResponse> {
  const key = resolveApiKey(apiKey);

  const response = await fetch(`${OLLAMA_BASE_URL}/api/web_search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      query,
      max_results: maxResults,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Ollama web search failed (${response.status}): ${text}`
    );
  }

  return (await response.json()) as WebSearchResponse;
}

/**
 * Fetch the content of a single web page by URL.
 *
 * @param url - The absolute URL to fetch
 * @param apiKey - Optional API key (defaults to OLLAMA_API_KEY env var)
 * @returns Page content, title, and links from the URL
 */
export async function webFetch(
  url: string,
  apiKey?: string
): Promise<WebFetchResponse> {
  const key = resolveApiKey(apiKey);

  const response = await fetch(`${OLLAMA_BASE_URL}/api/web_fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Ollama web fetch failed (${response.status}): ${text}`
    );
  }

  return (await response.json()) as WebFetchResponse;
}