import { MCPConnection } from './types/MCPConnection.js';

export function getToolsFromMcpConnections(connections: MCPConnection[]) {
    const allTools = [];
    for (const connection of connections) {
        for (const tool of connection.tools) {
            allTools.push({
                server: connection.name,
                ...tool
            });
        }
    }
    return allTools;
}
