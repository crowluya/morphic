# Environment Setup Instructions

1. Create a new file named `.env.local` in the project root directory
2. Copy the following configuration into the `.env.local` file:

```env
# OpenAI API Configuration
OPENAI_API_KEY=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
OPENAI_API_BASE_URL=https://openrouter.ai/api
OPENAI_API_MODEL=deepseek/deepseek-chat

# Search Configuration
SEARCH_API=searxng

# SearXNG Configuration
SEARXNG_API_URL=http://localhost:8080
SEARXNG_PORT=8080
SEARXNG_BIND_ADDRESS=0.0.0.0
SEARXNG_IMAGE_PROXY=true
SEARXNG_LIMITER=false
SEARXNG_DEFAULT_DEPTH=basic
SEARXNG_MAX_RESULTS=50
SEARXNG_ENGINES=google,bing,duckduckgo,wikipedia

# Other configurations from .env.local.example can be added as needed
```

3. Save the file and restart the application if it's running

Note: The `.env.local` file is gitignored for security reasons. Never commit API keys to version control.
