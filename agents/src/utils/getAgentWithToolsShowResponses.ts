export function getAgentWithToolsShowResponses() {
    return (process.env["AGENT_WITH_TOOLS_SHOW_RESPONSES"] ?? "false").localeCompare("true", undefined, { sensitivity: "accent" }) === 0;
}
