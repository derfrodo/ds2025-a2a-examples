import type { Client } from '@modelcontextprotocol/sdk/client';
import type { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { ListToolsResultSchema } from '@modelcontextprotocol/sdk/types.js';

export interface MCPConnection {
  name: string;
  client: Client;
  transport: StdioClientTransport;
  tools: typeof ListToolsResultSchema._type.tools;
}
