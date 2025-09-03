import type { Tool } from "ollama";
import { getToolsFromMcpConnections } from "./getToolsFromMcpConnections.js";
import type { MCPConnection } from "../types/MCPConnection.js";

export function getOllamaToolsFromMcpConnections(connections: MCPConnection[]) {
    const allTools = getToolsFromMcpConnections(connections);
    const tools: Tool[] = allTools.map(t => {
        return {
            function: {
                name: t.name,
                description: t.description || "",
                parameters: {
                    type: "object",
                    properties: t.inputSchema.properties as any,
                    required: t.inputSchema.required as any
                }
            }, type: "function"
        }
    });
    return tools;
}