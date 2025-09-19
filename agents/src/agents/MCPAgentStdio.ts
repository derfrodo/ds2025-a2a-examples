import * as readline from 'node:readline';
import { MCPAgent } from './MCPAgent.js';

export class MCPAgentStdio {
    private base: MCPAgent;
    private rl: readline.Interface;
    private name: string;

    constructor(name: string) {
        this.name = name;
        this.base = new MCPAgent();
        // Initialize readline interface for user interaction
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async initialize() {
        console.log(`🤖 Initializing ${this.name} Agent...`);
        await this.base.initialize()
        console.log(`✅ ${this.name} Agent initialized successfully!`);
    }

    async start() {
        console.log(`\n🚀 ${this.name} Agent is ready! Type your requests or "quit" to exit.\n`);

        this.promptUser();
    }

    private promptUser() {

        this.rl.question('You: ', async (input) => {
            const trimmed = input.trim();

            if (trimmed.toLowerCase() === 'quit' || trimmed.toLowerCase() === 'exit') {
                await this.shutdown();
                return;
            }

            if (trimmed === '') {
                this.promptUser();
                return;
            }

            try {
                const lastMessage = await this.base.processUserInput(trimmed);
                console.log(
                    `${lastMessage.role[0].toUpperCase()}${lastMessage.role.slice(1)}: ${lastMessage.content}`)
            } catch (err) {
                console.error('❌ Error processing request:', err);
            }
            this.promptUser();
        });
    }

    async shutdown() {
        console.log(`\n🔌 Shutting down ${this.name} Agent...`);
        this.base.shutdown();
        // Close readline
        this.rl.close();

        console.log('👋 Goodbye!');
        process.exit(0);
    }
}