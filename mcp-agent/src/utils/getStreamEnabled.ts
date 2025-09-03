export function getStreamEnabled() {
  return (process.env["ENABLE_STREAM"] ?? "false").localeCompare("true", undefined, { sensitivity: "accent" }) === 0;
}
