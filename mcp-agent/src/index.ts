import dotenv from 'dotenv';
import { MCPAgentStdio } from './MCPAgentStdio.js';

// Load environment variables
dotenv.config();

// Main execution
async function main() {
  const agent = new MCPAgentStdio('Annelise');

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await agent.shutdown();
  });

  try {
    await agent.initialize();
    // Welche Tankstellen haben e10 in der Nähe der Dortmund Voßkuhle
    // Wo ist in der Umgebung von Holzwickede Nordstraße im Umkreis von max 3 km der e10 Sprit am preiswertesten?
    // Wo ist in der Umgebung von Robert-Schuman-Straße 20 in Dortmund im Umkreis von max 3 km der Diesel am preiswertesten?
    // Wie weit ist die Robert-Schuman-Straße 20 in Dortmund von der Henrichshütte Hattingen entfernt?

    // Wo ist in der Umgebung der Henrichshütte in Hattingen im Umkreis von max 3 km E10 am preiswertesten?
    await agent.start();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main().catch(console.error);