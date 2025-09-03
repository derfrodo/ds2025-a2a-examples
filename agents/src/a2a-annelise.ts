import { AgentCard, MessageSendParams } from "@a2a-js/sdk";
import { A2AClient, } from "@a2a-js/sdk/client";
import dotenv from 'dotenv';
import { Tool } from "ollama";
import { v4 as uuidv4 } from "uuid";
import { AgentWithTools } from "./agents/AgentWithTools.js";
import { styleText } from "node:util";

dotenv.config();

async function run() {
    const port = Number(process.env.AGENT_ATHUR_PORT) || 10003;
    if (Number.isNaN(port) || !Number.isFinite(port)) {
        console.error("Invalid port number");
        return;
    }
    // Create a client pointing to the agent's Agent Card URL.
    const arthursClient = await A2AClient.fromCardUrl(`http://localhost:${port}/.well-known/agent-card.json`);

    const cardsToTools: { client: A2AClient, card: AgentCard, tools: Tool[] }[] = await Promise.all([arthursClient].map(async (c) => {
        const card = await c.getAgentCard();
        return ({
            client: c,
            card,
            tools: card.skills.map((skill) => ({
                type: "function",
                function: {
                    name: skill.name,
                    description: skill.description,
                    parameters: {
                        type: "object",
                        properties: {
                            text: {
                                type: "string",
                                description: "An english request which contains all relevant information for this tool."
                            },
                        },
                        required: ["text"]
                    }
                }
            }))
        })
    }));

    const agentAnnelise = new AgentWithTools("Annelise",
        cardsToTools.flatMap(c => c.tools),
        async (call) => {
            const clientToCall = cardsToTools.find(c => c.tools.find(t => t.function.name === call.function.name));
            const tool = clientToCall?.tools.find(t => t.function.name === call.function.name);

            if (!clientToCall || !tool) {
                console.error("No client found for tool call ", call.function.name);
                return { error: `No client found for tool call ${call.function.name}` };
            }
            console.log("Annelise is asked to perform tool call: ", call.function.name, call.function.arguments)

            const sendParams: MessageSendParams = {
                message: {
                    messageId: uuidv4(),
                    role: "user",
                    parts: [{ kind: "text", text: `Perform the task "${call.function.name}" which is "${tool.function.description}". Use the following information "${call.function.arguments.text}".` }],
                    kind: "message",
                },
            };

            const responseStream = await clientToCall.client.sendMessageStream(sendParams);

            for await (const event of responseStream) {
                if (event.kind === "task") {
                    console.log(
                        styleText(['italic', 'dim', 'white'],
                            `Got a task with state ${event.status.state}`));

                } else if (event.kind === "status-update") {
                    console.log(
                        styleText(['italic', 'dim', 'white'],
                            `Got a status update (${event.status.state})`));

                    if (event.status.message?.kind === "message") {
                        console.log(
                            styleText(['italic', 'dim', 'white'],
                                `    ℹ️ Update (${event.status.message.parts[0].kind}): ${event.status.message.parts[0].kind === "text" ? event.status.message.parts[0].text : JSON.stringify(event.status.message.parts[0])}`));
                    }

                    if (event.final) {
                        if (event.status.state === "completed") {
                            if (event.status.message?.kind === "message") {

                                console.log(
                                    styleText(['italic', 'dim', 'white'],
                                        `    ℹ️ Final message (${event.status.message.parts[0].kind}): ${event.status.message.parts[0].kind === "text" ? event.status.message.parts[0].text : JSON.stringify(event.status.message.parts[0])}`));


                                return {
                                    text: event.status.message.parts[0].kind === "text" ? event.status.message.parts[0].text : JSON.stringify(event.status.message.parts[0])
                                }
                            }
                        }
                        return { error: `Retrieved final event, but event state is ${event.status.state} and message is ${JSON.stringify(event.status.message)}. This was not expected and indicates an error.` }
                    }
                } else {
                    console.error("Failed to analyse intermediate event: ", event)
                }
            }

            console.error("No response received from tool call ", call.function.name);
            return { error: `"No response received from tool call ${call.function.name}"` };
        })

    await agentAnnelise.initialize();
    await agentAnnelise.start();

    console.log("Ask smart Annelise...")
    const message = "Wo ist in die Henrichshütte in Hattingen?";
    console.log(message);
    const result = await agentAnnelise.processUserInput(message);

    console.log("Annelise:" + result.content)
}

await run();