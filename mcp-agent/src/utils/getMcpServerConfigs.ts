import path from 'path';


export function getMcpServerConfigs() {
    return [
        {
            name: 'timo-mcp',
            command: 'npm',
            args: ['run', 'dev'],
            cwd: path.join(process.cwd(), '..', 'gas-stations-mcp'),
            env: { TANKERKOENIG_API_KEY: process.env.TANKERKOENIG_API_KEY || '' }
        },
        {
            name: 'karo-mcp',
            command: 'npm',
            args: ['run', 'dev'],
            cwd: path.join(process.cwd(), '..', 'navigation-mcp')
        },
        {
            name: 'ladesaeulen-mcp',
            command: 'npm',
            args: ['run', 'dev'],
            cwd: path.join(process.cwd(), '..', 'ladesaeulen-mcp')
        }
    ];
}
