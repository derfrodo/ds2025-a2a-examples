export function getThinkingEnabled() {
  return (process.env["ENABLE_THINKING"] ?? "false").localeCompare("true", undefined, { sensitivity: "accent" }) === 0;
}

