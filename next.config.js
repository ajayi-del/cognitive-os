/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  env: {
    // AI Provider Selection
    AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // DeepSeek (cheaper alternative)
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    // Kimi K2
    KIMIK2_API_KEY: process.env.KIMIK2_API_KEY,
    // Ollama (free local AI)
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    // Custom OpenAI-compatible API
    CUSTOM_AI_BASE_URL: process.env.CUSTOM_AI_BASE_URL,
    CUSTOM_AI_API_KEY: process.env.CUSTOM_AI_API_KEY,
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig
