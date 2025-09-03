import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ListToolsResultSchema, CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import path from 'path';

async function testMCPConnection() {
  console.log('🧪 Testing MCP Server Connections...\n');

  // Test nominatim server (doesn't require API key)
  try {
    console.log('Testing nominatim-mcp server...');
    
    const client = new Client({
      name: 'test-client',
      version: '1.0.0'
    });

    const transport = new StdioClientTransport({
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(process.cwd(), '..', 'nominatim-mcp')
    });

    await client.connect(transport);
    
    // List tools
    const toolsResponse = await client.request(
      { method: 'tools/list', params: {} },
      ListToolsResultSchema
    );

    console.log(`✅ Connected - ${toolsResponse.tools.length} tools available:`);
    toolsResponse.tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });

    // Test a tool call
    console.log('\nTesting nominatim-search tool...');
    const searchResult = await client.request({
      method: 'tools/call',
      params: {
        name: 'nominatim-search',
        arguments: {
          q: 'Berlin',
          limit: 1
        }
      }
    }, CallToolResultSchema);

    console.log('✅ Tool call successful!');
    console.log('Sample result:', JSON.stringify(searchResult, null, 2).substring(0, 200) + '...');

    await transport.close();
    console.log('✅ Connection closed successfully\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMCPConnection().catch(console.error);