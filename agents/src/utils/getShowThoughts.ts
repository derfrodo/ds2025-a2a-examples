export function getShowThoughts() {
  return (process.env["SHOW_THOUGHTS"] ?? "false").localeCompare("true", undefined, { sensitivity: "accent" }) === 0;
}
