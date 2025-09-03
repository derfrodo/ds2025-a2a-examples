import { styleText } from 'node:util';
import { ChatResponse, Fetch, Message, Ollama, Options, Tool, ToolCall } from 'ollama';
import { getMaxToolLoopCounts } from './utils/getMaxToolLoopCounts.js';
import { getOllamaModel } from './utils/getOllamaModel.js';
import { getShowThoughts } from './utils/getShowThoughts.js';
import { getStreamEnabled } from './utils/getStreamEnabled.js';
import { getThinkingEnabled } from './utils/getThinkingEnabled.js';
import { getAgentWithToolsShowResponses } from './utils/getAgentWithToolsShowResponses.js';

// Create a fetch function with custom timeout
const fetchWithTimeout: Fetch = (url, init = {}) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 600000) // 10 minutes

    return fetch(url, {
        ...init,
        signal: init.signal || controller.signal
    }).finally(() => clearTimeout(timeoutId))
}

export type ToolResult = { text?: string, error?: string } & ({ text: string } | { error: string });

export class AgentWithTools {
    private ollama: Ollama;
    private ollamaAvailable: boolean = false;
    private messages: Message[] = []
    private ollamaChatOptions: Partial<Options> = {
        num_thread: process.env.OLLAMA_NUM_THREADS && !Number.isNaN(parseInt(process.env.OLLAMA_NUM_THREADS)) ?
            parseInt(process.env.OLLAMA_NUM_THREADS) :
            undefined
    }
    private tools: Tool[];
    private name: string;
    private onCallTool: (toolCall: ToolCall) => (Promise<ToolResult> | ToolResult);

    constructor(
        name: string = "Agent 007",
        tools: Tool[],
        onCallTool: (toolCall: ToolCall) => (Promise<ToolResult> | ToolResult),
    ) {
        this.name = name;
        this.tools = tools;
        this.onCallTool = onCallTool;

        // Initialize Ollama client
        this.ollama = new Ollama({
            host: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
            fetch: fetchWithTimeout
        });
    }

    async initialize() {
        console.log(`🤖 Initializing ${this.name} Agent...`);

        this.messages.push({ role: 'system', content: this.createSystemPrompt() });

        // Test Ollama connection
        this.ollamaAvailable = await this.testOllamaConnection();

        console.log(`✅ ${this.name} Agent initialized successfully!`);
    }

    private async testOllamaConnection() {
        try {
            console.log('🧠 Testing Ollama connection...');
            const response = await this.ollama.generate({
                model: getOllamaModel(), // Using a common model, but we'll make this configurable
                prompt: 'Hello, respond with just "OK" if you can hear me.',
                options: !getThinkingEnabled() ? { num_predict: 10, ...this.ollamaChatOptions } : this.ollamaChatOptions,
                think: getThinkingEnabled(),
                stream: true,
            });

            for await (const data of response) {
                if (data.response) {
                    console.log('✅ Ollama is connected and working');
                    return true;
                }
            }
        } catch (error) {
            console.warn('⚠️ Ollama connection failed - agent will work without AI assistance');
            console.log('To enable full functionality, install and run Ollama with a model (e.g., llama3.2)');
            return false;
        }
        return false;
    }

    async start() {
        console.log(`\n🚀 ${this.name} Agent is ready! Type your requests or "quit" to exit.\n`);

    }

    private async getStreamedChatResponse(tools: Tool[]) {

        let streamedAnswer = await this.ollama.chat({
            options: this.ollamaChatOptions,
            model: getOllamaModel(),
            messages: this.messages,
            tools: tools,
            think: getThinkingEnabled(),
            stream: true,
        })

        let chatData: Partial<ChatResponse> & { message: ChatResponse["message"] } = {
            message: { content: "", role: "assistant" },
        }
        for await (const data of streamedAnswer) {
            const { content, role, thinking, ...dataMessage } = data.message
            const { content: previousContent, role: previousRole, thinking: previousThinking, ...previousMessage } = chatData.message
            chatData = {
                ...chatData,
                ...data,
                message: {
                    ...previousMessage,
                    role: role ?? previousRole,
                    content: previousContent + content,
                    ...(
                        (typeof previousThinking === "string" || typeof thinking === "string") ?
                            (typeof previousThinking === "string" && typeof thinking === "string") ?
                                { thinking: previousThinking + thinking } :
                                (typeof previousThinking === "string" && typeof thinking !== "string") ?
                                    { thinking: previousThinking } :
                                    (typeof previousThinking !== "string" && typeof thinking === "string") ?
                                        { thinking: thinking } :
                                        {} :
                            {}),
                    ...dataMessage,
                }
            }
        }
        return chatData as ChatResponse;
    }

    private async getChatResponse(tools: Tool[], messagesIfNeeded?: Message[]) {
        if (getStreamEnabled()) {
            return this.getStreamedChatResponse(tools);
        }

        let nextAnswer = await this.ollama.chat({
            options: this.ollamaChatOptions,
            model: getOllamaModel(),
            messages: messagesIfNeeded ?? this.messages,
            tools: tools,
            think: getThinkingEnabled(),
            stream: false,
        })

        return nextAnswer
    }

    private showThoughtsIfNeeded(message: Message) {
        if (typeof message.thinking === "string" && getShowThoughts()) {
            console.log(
                styleText(['italic', "dim", 'white'],
                    `💭 ${message.role[0].toUpperCase()}${message.role.slice(1)} (${this.name}) - ${message.thinking}`)
            )
        }
    }

    public async processUserInput(input: string) {
        try {
            console.log('\n🤔 Processing your request...');

            if (!this.ollamaAvailable) {
                console.log('🤖 Agent: Ollama is not available. Please make it available and restart this application.');
                throw new Error('🤖 Agent: Ollama is not available. Please make it available and restart this application.');
            }

            // Get all available tools

            const userMessage = { role: "user", content: input };
            this.messages.push(userMessage);

            let nextAnswer = await this.getChatResponse(this.tools)

            this.messages.push(nextAnswer.message)
            let toolCallCounter = 0;

            while (nextAnswer.message.tool_calls?.length ?? 0 > 0) {
                toolCallCounter++;
                const lastMessage = nextAnswer.message;
                this.showThoughtsIfNeeded(lastMessage);
                const calls = nextAnswer.message.tool_calls ?? [];
                if (calls && calls.length > 0 || nextAnswer.message.content === "") {
                    console.log(`🔧 Calling ${calls.length} tool(s)...`);

                    const toolResults = await Promise.all(calls.map(call => this.onCallTool(call)))
                    const responses =
                        toolResults.map(t => ({
                            role: "tool",
                            content: t.text ?? t.error ?? ""
                        }));

                        if (getAgentWithToolsShowResponses()) {
                            console.log("🔧 Tool results:", responses);
                        }
                    this.messages.push(...responses)

                    if (toolCallCounter < getMaxToolLoopCounts()) {
                        nextAnswer = await this.getChatResponse(this.tools)
                        this.messages.push(nextAnswer.message)
                    } else {
                        console.log('⚠️  Reached maximum number of tool call loops for a single user input. Stopping further tool calls.');

                        nextAnswer = await this.getChatResponse([])
                        this.messages.push(nextAnswer.message)
                        break;
                    }
                }
            }
            const lastMessage = this.messages[this.messages.length - 1];
            this.showThoughtsIfNeeded(lastMessage);
            return lastMessage;

        } catch (error) {
            console.error('❌ Error processing request:', error);
            throw error
        }
    }

    private createSystemPrompt() {
        let prompt = 'You are an AI assistant with access to the following tools:\n\n';
        prompt += '\nWhen a user makes a request and you can answer sufficiently on your own or from context and message history, answer with this information. If you can not answer and you need further information, determine which tools would be helpful and call the tool. If nothing applies, please say so.';
        return prompt;
    }


    async shutdown() {
        console.log(`\n🔌 Shutting down ${this.name} Agent...`);

        console.log('👋 Goodbye!');
    }
}

