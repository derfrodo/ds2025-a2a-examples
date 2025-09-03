export function getMaxToolLoopCounts() {
  const value = Number(process.env["MAX_TOOL_CALL_LOOPS_FOR_USERINPUT"] ?? "4");
  return Number.isNaN(value) || value <= 0 ? 4 : value;
}
