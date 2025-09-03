export function getOllamaModel() {
  return process.env["OLLAMA_MODEL"] ?? "llama3.1:latest";
}
