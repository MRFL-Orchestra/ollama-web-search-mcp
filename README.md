# ollama-web-search-mcp

A Node.js MCP (Model Context Protocol) server that exposes [Ollama's web search and web fetch APIs](https://docs.ollama.com/capabilities/web-search) as MCP tools.

This is the JavaScript/TypeScript equivalent of Ollama's [official Python MCP server](https://github.com/ollama/ollama-python/blob/main/examples/web-search-mcp.py) — designed for any MCP client that prefers or requires a Node.js process.

## Features

- **`web_search`** — Performs a web search via Ollama's hosted API and returns results (title, URL, content snippet)
- **`web_fetch`** — Fetches a single web page by URL and returns its title, content, and links
- Stdio transport (standard for MCP servers)
- Zero runtime dependencies beyond the MCP SDK
- Publishes as an npm package with a CLI binary

## Prerequisites

- Node.js 18 or higher
- An [Ollama API key](https://ollama.com/settings/keys) (free Ollama account required)

## Installation

### From npm

```bash
npm install -g ollama-web-search-mcp
```

### From source

```bash
git clone https://github.com/MRFL-Orchestra/ollama-web-search-mcp.git
cd ollama-web-search-mcp
npm install
npm run build
```

## Configuration

Set your Ollama API key as an environment variable:

```bash
export OLLAMA_API_KEY="your_api_key_here"
```

### MCP Client Setup

Add the server to your MCP client configuration:

#### Claude Desktop / Cursor / VS Code

```json
{
  "mcpServers": {
    "ollama-web-search": {
      "command": "npx",
      "args": ["ollama-web-search-mcp"],
      "env": {
        "OLLAMA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Cline

```json
{
  "mcpServers": {
    "ollama-web-search": {
      "type": "stdio",
      "command": "npx",
      "args": ["ollama-web-search-mcp"],
      "env": {
        "OLLAMA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Codex

```toml
[mcp_servers.ollama-web-search]
command = "npx"
args = ["ollama-web-search-mcp"]
env = { "OLLAMA_API_KEY" = "your_api_key_here" }
```

#### Local clone (without npm)

```json
{
  "mcpServers": {
    "ollama-web-search": {
      "command": "node",
      "args": ["/path/to/ollama-web-search-mcp/dist/index.js"],
      "env": {
        "OLLAMA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Tools

### `web_search`

Performs a web search using Ollama's hosted search API.

**Parameters:**
- `query` (string, required) — The search query string
- `max_results` (integer, optional, default 5, max 10) — Maximum results to return

**Returns:** Array of search results, each containing:
- `title` — Title of the web page
- `url` — URL of the web page
- `content` — Relevant content snippet

### `web_fetch`

Fetches the content of a single web page by URL.

**Parameters:**
- `url` (string, required) — The absolute URL to fetch

**Returns:**
- `title` — Title of the web page
- `content` — Main content of the web page
- `links` — Array of links found on the page

## API Reference

You can also use the client functions directly in your own code:

```typescript
import { webSearch, webFetch } from "ollama-web-search-mcp";

// Web search
const results = await webSearch("what is ollama?", 5);
console.log(results.results[0].title);

// Web fetch
const page = await webFetch("https://ollama.com");
console.log(page.title);
console.log(page.links);
```

Both functions accept an optional `apiKey` parameter (defaults to `OLLAMA_API_KEY` environment variable).

## Development

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript
npm run dev          # Watch mode
npm run typecheck    # Type-check without emitting
```

## License

MIT