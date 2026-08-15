#!/usr/bin/env node

/**
 * Ollama Web Search MCP Server
 *
 * A Model Context Protocol (MCP) server that exposes Ollama's web search
 * and web fetch APIs as MCP tools. Runs over stdio transport.
 *
 * @see https://docs.ollama.com/capabilities/web-search
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { webSearch, webFetch } from "./ollama.js";

const server = new McpServer({
  name: "ollama-web-search-mcp",
  version: "1.0.0",
});

// ── Tool: web_search ────────────────────────────────────────────────

server.tool(
  "web_search",
  "Perform a web search using Ollama's hosted search API. Returns an array of results with title, url, and content for each match.",
  {
    query: z.string().describe("The search query string"),
    max_results: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum results to return (default 5, max 10)"),
  },
  async ({ query, max_results }) => {
    try {
      const result = await webSearch(query, max_results);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// ── Tool: web_fetch ──────────────────────────────────────────────────

server.tool(
  "web_fetch",
  "Fetch the content of a single web page by URL. Returns the page title, main content, and links found on the page.",
  {
    url: z.string().describe("The absolute URL to fetch"),
  },
  async ({ url }) => {
    try {
      const result = await webFetch(url);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// ── Start server ─────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});