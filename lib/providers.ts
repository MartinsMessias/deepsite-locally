export const PROVIDERS = {
  "openai-compatible": {
    name: "OpenAI Compatible",
    max_tokens: 256_000,
    id: "openai-compatible",
  },
};

export const MODELS = [
  {
    value: "codestral-latest", // Default model, can be overridden by user
    label: "Codestral (Default)",
    providers: ["openai-compatible"],
    autoProvider: "openai-compatible",
    isThinker: false,
  },
];
