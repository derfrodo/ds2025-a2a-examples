import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ListToolsResultSchema, CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import path from 'path';
import { isNativeError } from 'util/types';

async function demonstrateAgent() {
  console.log('🎬 MCP Agent Demo - Manual Tool Calls\n');

  // Test all three servers
  const serverConfigs = [
    {
      name: 'nominatim-mcp',
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(process.cwd(), '..', 'nominatim-mcp'),
      testTool: {
        name: 'nominatim-search',
        args: { q: 'Berlin', limit: 1 }
      }
    },
    {
      name: 'ladesaeulen-mcp',
      command: 'npm',
      args: ['run', 'dev'],
      cwd: path.join(process.cwd(), '..', 'ladesaeulen-mcp'),
      testTool: {
        name: 'e-charging-stations',
        args: { limit: 1 }
      }
    }
  ];

  for (const config of serverConfigs) {
    console.log(`🔌 Testing ${config.name}...`);

    try {
      const client = new Client({
        name: 'demo-client',
        version: '1.0.0'
      });

      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        cwd: config.cwd,
        env: process.env 
      } as any);

      console.log('   Connecting...');
      await client.connect(transport);

      // List tools
      const toolsResponse = await client.request(
        { method: 'tools/list', params: {} },
        ListToolsResultSchema
      );

      console.log(`   ✅ Connected - ${toolsResponse.tools.length} tools available:`);
      toolsResponse.tools.forEach(tool => {
        console.log(`      - ${tool.name}: ${tool.description}`);
      });

      // Test a tool call
      console.log(`\n   🔧 Testing ${config.testTool.name}...`);
      const result = await client.request({
        method: 'tools/call',
        params: {
          name: config.testTool.name,
          arguments: config.testTool.args
        }
      }, CallToolResultSchema);
      console.log({ result: JSON.stringify(result, null, 2) });

      console.log('   ✅ Tool call completed!');
      console.log('   📄 Response structure:', Object.keys(result));

      await transport.close();
      console.log('   🔌 Connection closed\\n');

    } catch (error) {
      console.error(`   ❌ ${config.name} test failed:`, isNativeError(error) ? error.message : error);
      console.log();
    }
  }

  console.log('🎉 Demo completed! The agent successfully demonstrated:');
  console.log('   ✅ Connecting to multiple MCP servers');
  console.log('   ✅ Listing available tools');
  console.log('   ✅ Calling tools with parameters');
  console.log('   ✅ Proper connection management');
  console.log();
  console.log('🚀 To run the full interactive agent: npm run dev');
}

demonstrateAgent().catch(console.error);