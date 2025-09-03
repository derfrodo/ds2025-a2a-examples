import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema, ListToolsResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { ToolCall } from 'ollama';
import { AgentWithTools, type ToolResult } from './AgentWithTools.js';
import { MCPConnection } from './types/MCPConnection.js';
import { getMcpServerConfigs } from './utils/getMcpServerConfigs.js';
import { getOllamaToolsFromMcpConnections } from './utils/getOllamaToolsFromMcpConnections.js';

export class MCPAgent {
    private connections: MCPConnection[] = [];

    private agentWithTools: AgentWithTools | null = null;

    private name: string;

    constructor(name: string = "MCP") {
        this.name = name
    }

    async initialize() {
        console.log(`🤖 Initializing ${this.name} Agent...`);

        // Connect to all three MCP servers
        await this.connectToMCPServers();
        const tools = getOllamaToolsFromMcpConnections(this.connections)

        this.agentWithTools = new AgentWithTools(
            `${this.name} (inner agent)`,
            tools,
            (call) => this.executeToolCall(call)
        );
        await this.agentWithTools.initialize();

        console.log(`✅ ${this.name} Agent initialized successfully!`);
    }

    private async connectToMCPServers() {
        const serverConfigs = getMcpServerConfigs();

        for (const config of serverConfigs) {
            try {
                console.log(`🔌 Connecting to ${config.name}...`);

                const client = new Client({
                    name: `mcp-agent-client`,
                    version: '1.0.0'
                });

                const transport = new StdioClientTransport({
                    command: config.command,
                    args: config.args,
                    cwd: config.cwd,
                    env: { ...process.env, ...config.env }
                });

                await client.connect(transport);

                // Get available tools
                const toolsResponse: typeof ListToolsResultSchema._type = await client.request(
                    { method: 'tools/list', params: {} },
                    ListToolsResultSchema
                );

                const connection: MCPConnection = {
                    name: config.name,
                    client,
                    transport,
                    tools: toolsResponse.tools
                };

                this.connections.push(connection);

                console.log(`✅ Connected to ${config.name} - ${toolsResponse.tools.length} tools available`);
                toolsResponse.tools.forEach(tool => {
                    console.log(`   - ${tool.name}: ${tool.description}`);
                });

            } catch (error) {
                console.error(`❌ Failed to connect to ${config.name}:`, error);
            }
        }
    }

    async start() {
        if (!this.agentWithTools) {
            throw new Error("You must initialize this agent first.")
        }
        this.agentWithTools?.start();
    }

    public async processUserInput(input: string) {
        if (!this.agentWithTools) {
            throw new Error("You must initialize this agent first.")
        }
        return await this.agentWithTools?.processUserInput(input);
    }

    private async executeToolCall(toolCall: ToolCall): Promise<ToolResult> {
        try {
            // Find the connection that has this tool
            const connection = this.findConnectionForTool(toolCall.function.name);
            if (!connection) {
                console.error(`⚠️  Tool ${toolCall.function.name} not found`);
                return { error: `Tool ${toolCall.function.name} not found` };
            }

            console.log(`   Calling ${toolCall.function.name}.`);
            let toolCallArguments = toolCall.function.arguments;

            console.log(`       Use arguments for tool call of ${toolCall.function.name}.`, toolCallArguments);

            const result = await connection.client.request({
                method: 'tools/call',
                params: {
                    name: toolCall.function.name,
                    arguments: toolCallArguments
                }
            }, CallToolResultSchema);
            return { text: result.content[0].type === "text" ? result.content[0].text : "" };

        } catch (error) {
            console.error(`❌ Error calling ${toolCall.function.name}:`, error);
            return ({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    private findConnectionForTool(toolName: string): MCPConnection | null {
        for (const connection of this.connections) {
            if (connection.tools.some(tool => tool.name === toolName)) {
                return connection;
            }
        }
        return null;
    }

    async shutdown() {
        console.log(`\n🔌 Shutting down ${this.name} Agent...`);
        this.agentWithTools?.shutdown();
        this.agentWithTools = null
        // Close all MCP connections
        for (const connection of this.connections) {
            try {
                await connection.transport.close();
                console.log(`✅ Disconnected from ${connection.name}`);
            } catch (error) {
                console.error(`❌ Error disconnecting from ${connection.name}: `, error);
            }
        }

        console.log('👋 Goodbye!');
    }
}
