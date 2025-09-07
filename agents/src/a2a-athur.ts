import express from "express";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

import {
    AgentCard,
    Message,
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
import { styleText } from "node:util";
import { AgentWithTools } from "./agents/AgentWithTools.js";
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
        streaming: true
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


            const taskId = uuidv4()
            eventBus.publish({
                kind: "task",
                status: { state: "submitted" },
                id: taskId,
                contextId: requestContext.contextId,
            });

            const result = await this.baseAgent.processUserInput(requestContext.userMessage.parts[0].text,

                async msg => {
                    console.log(
                        styleText(['italic', 'dim', 'white'],
                            `    🤖 Got an intermediate event: ${msg.content} (💭 ${msg.thinking ?? ""})`));

                    eventBus.publish({
                        kind: "status-update",
                        taskId,
                        contextId: requestContext.contextId,
                        final: false,
                        status: {
                            state: "working",
                            message: {
                                kind: "message",
                                messageId: uuidv4(),
                                parts: [{
                                    kind: "text",
                                    text: msg.content === "" ? msg.thinking ?? "" : msg.content
                                }],
                                role: "agent",
                            }
                        }
                    });
                },
                {
                    previousMessages: [AgentWithTools.createDefaultSystempromptForAgentWithTools()],
                    onDone: () => {
                        // You might want to save this for later or other chats with the same client?
                    }
                }
            );
            // Create a direct message response.
            const responseMessage: Message = {
                kind: "message",
                messageId: uuidv4(),
                role: "agent",
                parts: [{ kind: "text", text: result.content }],
                // Associate the response with the incoming request's context.
                contextId: requestContext.contextId,
            };


            eventBus.publish({
                kind: "status-update",
                taskId,
                contextId: requestContext.contextId,
                final: true,
                status: {
                    state: "completed",
                    message: responseMessage
                }
            });
            console.log(
                styleText([ 'dim', 'white'],
                    `    🤖 Got a final message: `),

                styleText(['italic', 'dim', 'white'],
                    `${result.content} (💭 ${result.thinking ?? ""})`)
            );


            console.log("Reached final answer. Will return it to the agent on the other side...")

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
