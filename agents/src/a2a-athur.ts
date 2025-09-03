import express from "express";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

import {
    AgentCard,
    Message
} from "@a2a-js/sdk";
import {
    AgentExecutor,
    DefaultRequestHandler,
    ExecutionEventBus,
    InMemoryTaskStore,
    RequestContext
} from "@a2a-js/sdk/server"; // Import server components
import { A2AExpressApp } from "@a2a-js/sdk/server/express";

import * as dotenv from "dotenv";
import { MCPAgent } from "./agents/MCPAgent.js";
dotenv.config();

const athurAgentCard: (port: number) => AgentCard = (port) => ({
    name: "Agent Athur",
    description: "A simple agent can assist with geographic queries.",
    protocolVersion: "0.3.0",
    version: "0.1.0",
    url: `http://localhost:${port}/`, // The public URL of your agent server
    skills: [{
        id: "find-a-place", name: "Find a Place", description: "Find a place by name or location.", tags: ["geography", "location"]
    }],
    capabilities: {
    },
    defaultOutputModes: ["text"],
    defaultInputModes: ["text"],
});

class AgentAthurExecutor implements AgentExecutor {
    private baseAgent: MCPAgent;

    constructor(baseAgent: MCPAgent) {
        this.baseAgent = baseAgent;
    }

    async execute(
        requestContext: RequestContext,
        eventBus: ExecutionEventBus
    ): Promise<void> {
        if (requestContext.userMessage.parts.length === 0) {
            return;
        }

        if (requestContext.userMessage.parts[0].kind === "text") {
            console.log(`Athur retrieved a message: ${requestContext.userMessage.parts[0].text}`)
            const result = await this.baseAgent.processUserInput(requestContext.userMessage.parts[0].text);
            // Create a direct message response.
            const responseMessage: Message = {
                kind: "message",
                messageId: uuidv4(),
                role: "agent",
                parts: [{ kind: "text", text: result.content }],
                // Associate the response with the incoming request's context.
                contextId: requestContext.contextId,
            };

            // Publish the message and signal that the interaction is finished.
            eventBus.publish(responseMessage);
            eventBus.finished();
            return;
        }
        eventBus.publish({
            messageId: uuidv4(),
            kind: "message",
            contextId: requestContext.contextId,
            role: "agent",
            parts: [{ kind: "text", text: "Failed to resolve your request, I am horribly sorry. :/" }],
        });
        eventBus.finished();

    }

    // cancelTask is not needed for this simple, non-stateful agent.
    async cancelTask(_taskId: string, _eventBus: ExecutionEventBus): Promise<void> { }
}

async function main() {
    const port = Number(process.env.AGENT_ATHUR_PORT) || 10003;
    if (Number.isNaN(port) || !Number.isFinite(port)) {
        console.error("Invalid port number");
        return;
    }
    const agent = new MCPAgent("Agent Athur");
    await agent.initialize();
    const agentExecutor = new AgentAthurExecutor(agent);
    const requestHandler = new DefaultRequestHandler(
        athurAgentCard(port),
        new InMemoryTaskStore(),
        agentExecutor
    );

    const appBuilder = new A2AExpressApp(requestHandler);
    const expressApp = appBuilder.setupRoutes(express());

    expressApp.listen(port, () => {
        console.log(`🚀 Server started on http://localhost:${port}`);
        console.log(`🚀 Please find the agent card at http://localhost:${port}/.well-known/agent-card.json`);
    });
}

main().catch((err) => {
    console.error("Error occurred:", err);
});
